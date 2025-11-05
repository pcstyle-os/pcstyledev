# SSH Connection Troubleshooting

## Problem: Can ping but can't connect via SSH

If you can ping `ssh.pcstyle.dev` but SSH connection fails, check these:

### 1. Check Railway TCP Proxy Configuration

Railway might not have TCP proxy enabled, or it's using a different port.

**Steps:**
1. Go to Railway Dashboard → Your Service → Settings → Networking
2. Check if **Public Networking** is enabled
3. Look for **TCP Proxy** or **Public Ports** section
4. Verify port 22 is configured

### 2. Railway Might Use Different Port

Railway sometimes assigns random ports for TCP. Check:
- Railway Dashboard → Networking → Public Ports
- You might see something like: `Port 54321 → Service Port 22`

**Connect using Railway's assigned port:**
```bash
ssh -p 54321 ssh.pcstyle.dev
# or
ssh -p 54321 wxvnwyub.up.railway.app
```

### 3. Check SSH Server Logs

```bash
railway logs
```

Look for:
- `✓ Listening on 0.0.0.0:22` or similar
- Any error messages
- Connection attempts

### 4. Test Direct Connection

Try connecting directly to Railway's TCP endpoint:

```bash
# If Railway shows a TCP hostname like:
ssh -p 22 tcp-production-xxxx.up.railway.app

# Or with assigned port:
ssh -p 54321 tcp-production-xxxx.up.railway.app
```

### 5. Common Issues

**Port 22 might be blocked:**
- Some platforms block port 22 for security
- Railway might require using a different port
- Check Railway's port assignment

**SSH server not running:**
- Check Railway logs for startup errors
- Verify `package.json` has correct start script
- Check if server.js is the entry point

**Firewall/Network issues:**
- Railway might have firewall rules
- Check Railway Networking settings
- Verify TCP proxy is actually enabled

### 6. Alternative: Use Non-Standard Port

If port 22 doesn't work, try:
1. Change `SSH_PORT` env var to something like `2222`
2. Configure Railway TCP proxy for port 2222
3. Connect: `ssh -p 2222 ssh.pcstyle.dev`

### 7. Verify Service is Running

```bash
# Check Railway dashboard
# Service → Metrics → Should show CPU/memory usage

# Or check logs
railway logs --tail 50
```

---

**Quick Debug Checklist:**
- [ ] Railway Public Networking enabled?
- [ ] TCP Proxy configured?
- [ ] SSH_PORT env var matches Railway port?
- [ ] SSH server logs show "Listening on..."?
- [ ] Trying correct port (might not be 22)?
- [ ] Railway service is running (not crashed)?





