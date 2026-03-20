#!/usr/bin/env bun
/**
 * Fill GITHUB_TOKEN + GITHUB_USERNAME from the GitHub CLI (logged-in account).
 *
 *   bun run github:env              → dotenv lines (append to .env.local)
 *   bun run github:env -- --export  → export VAR=... (eval in current shell)
 *
 * Requires: `gh` installed and `gh auth login` done.
 * Note: Vercel Edge cannot run gh — set env vars in the dashboard for production.
 */

function runGh(args: string[]): { ok: true; out: string } | { ok: false; err: string } {
  try {
    const proc = Bun.spawnSync(["gh", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode !== 0) {
      return {
        ok: false,
        err: proc.stderr.toString().trim() || proc.stdout.toString().trim() || `gh ${args.join(" ")} failed`,
      };
    }
    return { ok: true, out: proc.stdout.toString().trim() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, err: msg || "gh spawn failed (is gh installed and on PATH?)" };
  }
}

const wantExport = process.argv.includes("--export");

const tokenResult = runGh(["auth", "token"]);
if (!tokenResult.ok) {
  console.error("[github:env] Could not read token. Install gh and run `gh auth login`.\n", tokenResult.err);
  process.exit(1);
}

const userResult = runGh(["api", "user", "--jq", ".login"]);
if (!userResult.ok) {
  console.error("[github:env] Could not read username.\n", userResult.err);
  process.exit(1);
}

const token = tokenResult.out;
const username = userResult.out;

if (!token || !username) {
  console.error("[github:env] Empty token or username.");
  process.exit(1);
}

const t = JSON.stringify(token);
const u = JSON.stringify(username);

if (wantExport) {
  console.log(`export GITHUB_TOKEN=${t}`);
  console.log(`export GITHUB_USERNAME=${u}`);
} else {
  console.log(`GITHUB_TOKEN=${t}`);
  console.log(`GITHUB_USERNAME=${u}`);
}
