# Cloudflare DNS Setup for SSH

## Current Setup

- **Railway Proxy**: `yamanote.proxy.rlwy.net:49358`
- **Railway IP**: `66.33.22.95` (may change)
- **Target**: `ssh.pcstyle.dev` → Railway TCP endpoint

## Problem

Railway uses a proxy hostname (`yamanote.proxy.rlwy.net`) which changes on redeploy. We need to point `ssh.pcstyle.dev` to Railway's TCP endpoint.

## Solution: Use Cloudflare DNS with SRV Record

### Option 1: SRV Record (Recommended for SSH)

SRV records allow you to specify both hostname and port.

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - Select your domain `pcstyle.dev`

2. **Add SRV Record:**
   - Go to **DNS** → **Records**
   - Click **Add record**
   - Select **SRV**
   - Configure:
     ```
     Name: _ssh._tcp.ssh
     Service: _ssh
     Proto: _tcp
     Priority: 0
     Weight: 5
     Port: 49358
     Target: yamanote.proxy.rlwy.net
     TTL: Auto
     Proxy status: DNS only (gray cloud)
     ```

3. **Connect:**
   ```bash
   ssh ssh.pcstyle.dev
   # SSH will automatically use SRV record to find port
   ```

### Option 2: CNAME Record (Simple, but requires port)

1. **Add CNAME Record:**
   ```
   Type: CNAME
   Name: ssh
   Target: yamanote.proxy.rlwy.net
   Proxy status: DNS only (gray cloud - IMPORTANT!)
   TTL: Auto
   ```

2. **Connect (must specify port):**
   ```bash
   ssh -p 49358 ssh.pcstyle.dev
   ```

### Option 3: A Record (If Railway gives static IP)

**Note:** Railway IPs can change, so this isn't recommended unless Railway provides a static IP.

1. **Add A Record:**
   ```
   Type: A
   Name: ssh
   IPv4 address: 66.33.22.95
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

2. **Connect:**
   ```bash
   ssh -p 49358 ssh.pcstyle.dev
   ```

## Important: Disable Cloudflare Proxy!

**CRITICAL:** For SSH to work, you MUST set the proxy status to **DNS only** (gray cloud icon), NOT proxied (orange cloud).

- ✅ **Gray cloud** = DNS only (works for SSH)
- ❌ **Orange cloud** = Proxied (blocks SSH, only HTTP/HTTPS)

## Verification

After setting up DNS:

```bash
# Check DNS resolution
dig ssh.pcstyle.dev

# Or with SRV record:
dig SRV _ssh._tcp.ssh.pcstyle.dev

# Test connection
ssh -p 49358 ssh.pcstyle.dev
```

## Update Website Command

The website command in `SSHContactModal.tsx` has been updated to:
```typescript
const SSH_COMMAND = "ssh -p 49358 ssh.pcstyle.dev";
```

If you set up SRV record, you can change it back to:
```typescript
const SSH_COMMAND = "ssh ssh.pcstyle.dev";
```

---

**Recommended:** Use SRV record (Option 1) - it's the proper way for SSH and allows connecting without specifying port!

