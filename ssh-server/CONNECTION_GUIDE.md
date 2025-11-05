# SSH Connection Guide

## Quick Connect

After Railway deploy, connect using:

```bash
# Accept the new host key when prompted
ssh -p 49358 yamanote.proxy.rlwy.net
```

Or if DNS is configured:
```bash
ssh -p 49358 ssh.pcstyle.dev
```

## Fix "Host key changed" Warning

If you see a warning about host key change (normal after Railway redeploy):

```bash
# Remove old host key
ssh-keygen -R "[yamanote.proxy.rlwy.net]:49358"

# Or use -o StrictHostKeyChecking=no for first connection
ssh -o StrictHostKeyChecking=no -p 49358 yamanote.proxy.rlwy.net
```

## Current Setup

- **Proxy**: `yamanote.proxy.rlwy.net:49358`
- **UI**: Simple ANSI-based (reliable, works everywhere)
- **Form**: Terminal-based contact form with colored prompts

## Troubleshooting

**Connection closed immediately:**
- Check Railway logs: `railway logs`
- Verify service is running
- Check if port 49358 is correct in Railway dashboard

**Host key warning:**
- Normal after Railway redeploy
- Remove old key or use `-o StrictHostKeyChecking=no`

**Form not showing:**
- Try resizing terminal window
- Check Railway logs for errors
- Ensure terminal supports ANSI colors

---

**Connection should work now!** The simple UI is more reliable than blessed for SSH connections.


