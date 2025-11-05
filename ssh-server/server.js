import fs from 'fs';
import { generateKeyPairSync } from 'crypto';
import ssh2 from 'ssh2';
import axios from 'axios';
import dotenv from 'dotenv';
import { createContactForm } from './ui.js';

const { Server } = ssh2;

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api/contact';
// Heroku assigns PORT, but SSH needs a custom port
// For Heroku, you'll need to use a tunnel service or Railway/Fly.io
// This will use SSH_PORT if set, otherwise PORT, otherwise default to 2222
const SSH_PORT = parseInt(
  process.env.SSH_PORT || 
  process.env.PORT || 
  '2222', 
  10
);
const SSH_HOST = process.env.SSH_HOST || '0.0.0.0';
const SSH_PASSWORD = process.env.SSH_PASSWORD || null;

// Generate or load host keys
const HOST_KEY = fs.existsSync('./host.key')
  ? fs.readFileSync('./host.key')
  : generateHostKey();

function generateHostKey() {
  console.log('⚠️  No host.key found. Generating a new one...');
  console.log('⚠️  For production, generate a proper key with:');
  console.log('    ssh-keygen -t rsa -b 4096 -f host.key -N ""');

  // For development only - use a simple key
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  fs.writeFileSync('./host.key', privateKey);
  console.log('✓ Generated host.key (development only)');
  return privateKey;
}

async function submitToAPI(formData) {
  try {
    const response = await axios.post(API_URL, {
      ...formData,
      source: 'ssh',
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error('API submission error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Create SSH server
const sshServer = new Server({
  hostKeys: [HOST_KEY],
}, (client, info) => {
  console.log(`📡 Client connected from ${info.ip}`);

  let authenticated = false;
  let sessionStream = null;

  client.on('authentication', (ctx) => {
    // If password is set, require authentication
    if (SSH_PASSWORD) {
      if (ctx.method === 'password') {
        if (ctx.password === SSH_PASSWORD) {
          ctx.accept();
          authenticated = true;
        } else {
          ctx.reject();
        }
      } else {
        ctx.reject(['password']);
      }
    } else {
      // No password required - open access
      ctx.accept();
      authenticated = true;
    }
  });

  client.on('ready', () => {
    console.log('✓ Client authenticated');

    client.on('session', (accept) => {
      const session = accept();
      let ptyInfo = null;

      session.on('pty', (accept, reject, info) => {
        ptyInfo = info;
        const ptyStream = accept();
        if (ptyStream) {
          ptyStream.columns = info.cols;
          ptyStream.rows = info.rows;

          // Set terminal type for blessed
          if (info.term) {
            process.env.TERM = info.term;
          }
        }
      });

      session.on('window-change', (accept, reject, info) => {
        if (sessionStream) {
          sessionStream.columns = info.cols;
          sessionStream.rows = info.rows;
          sessionStream.emit('resize');
        }
        accept && accept();
      });

      session.on('shell', (accept) => {
        try {
          sessionStream = accept();
          if (!sessionStream) {
            console.error('❌ Failed to accept shell session');
            return;
          }

          // Set up terminal properties BEFORE creating UI
          if (ptyInfo) {
            sessionStream.columns = ptyInfo.cols || 80;
            sessionStream.rows = ptyInfo.rows || 24;
            sessionStream.isTTY = true;
            sessionStream.isRaw = true; // Enable raw mode for proper input handling
          } else {
            // Default terminal size if PTY not set
            sessionStream.columns = 80;
            sessionStream.rows = 24;
            sessionStream.isTTY = true;
            sessionStream.isRaw = true; // Enable raw mode for proper input handling
          }

          // Set terminal type for proper rendering
          process.env.TERM = ptyInfo?.term || 'xterm-256color';
          process.env.COLUMNS = String(sessionStream.columns);
          process.env.LINES = String(sessionStream.rows);

          // Handle stream errors
          sessionStream.on('error', (err) => {
            console.error('❌ Stream error:', err.message);
          });

          // Use blessed UI (main UI)
          setTimeout(() => {
            try {
              console.log('Creating contact form with blessed UI');
              createContactForm(sessionStream, async (formData) => {
                return await submitToAPI(formData);
              });
            } catch (err) {
              console.error('❌ Error creating contact form:', err);
              sessionStream.write('\r\nError initializing form. Please try again.\r\n');
              sessionStream.write(`Error: ${err.message}\r\n`);
              // Don't end stream immediately, let user see the error
              setTimeout(() => sessionStream.end(), 5000);
            }
          }, 100);
        } catch (err) {
          console.error('❌ Error in shell handler:', err);
        }
      });

      session.on('exec', (accept, reject, info) => {
        // Don't allow command execution
        reject();
      });
    });
  });

  client.on('error', (err) => {
    console.error('❌ Client error:', err.message);
  });

  client.on('end', () => {
    console.log('👋 Client disconnected');
  });
});

sshServer.on('error', (err) => {
  console.error('❌ SSH Server error:', err);
});

// Start the server
sshServer.listen(SSH_PORT, SSH_HOST, () => {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║   🚀 pcstyle.dev SSH Contact Form Server                     ║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✓ Listening on ${SSH_HOST}:${SSH_PORT}`);
  console.log(`✓ API endpoint: ${API_URL}`);
  console.log(`✓ Authentication: ${SSH_PASSWORD ? 'Password required' : 'Open access'}`);
  console.log('');
  console.log('Connect with:');
  console.log(`  ssh -p ${SSH_PORT} ${SSH_HOST === '0.0.0.0' ? 'localhost' : SSH_HOST}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down SSH server...');
  sshServer.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down SSH server...');
  sshServer.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
