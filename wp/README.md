# CommercialKonnect — local WordPress build

Local-only WordPress dev stack. This is where we build the new public site that will
eventually replace the Lovable frontend at commercialkonnect.ca and resolve the technical
SEO gates (SSR, self-canonical URLs, crawler access) from `docs/SEO_PLAN.md` §2.

**Nothing here is public, and nothing publishes a lender.** The compliance publication gate
(`docs/SEO_PLAN.md` §1 / `docs/LENDER_DIRECTORY.md`) still governs go-live. Build freely
locally; publishing is blocked until counsel clears B1/B3 and every lender is verified (B2).

## What's version-controlled here

| Path | Tracked? | What it is |
|---|---|---|
| `docker-compose.yml` | yes | Local WP 6.7+/PHP 8.3 + MariaDB, `localhost:8090` |
| `.env.example` | yes | Local dev DB defaults (not secrets) |
| `mu-plugins/ck-lender-cpt.php` | yes | The `lender` CPT + the verification publication gate |
| `plugins/wp-mcp-ultimate/` | **no** (gitignored) | Third-party MCP plugin, cloned by you |
| `.env`, db/core volumes | **no** | Local state |

## Why mu-plugins

The lender CPT lives in `mu-plugins/` (must-use) on purpose: must-use plugins auto-load and
**cannot be deactivated from wp-admin**. The verification gate (an unverified lender never
renders publicly) therefore can't be switched off by a careless click. See the file header.

## Setup

### 1. Bring up WordPress

```bash
cd wp
cp .env.example .env        # optional; defaults work as-is
docker compose up -d
```

Open http://localhost:8090 and finish the WP install wizard (site title, admin user).
After login you'll see a **Lenders** menu in wp-admin — that's the CPT, already registered
by the mu-plugin. New lenders default to `verification_status = unverified` and will NOT
appear on the public front end.

### 2. Install the MCP plugin

```bash
cd wp/plugins
git clone https://github.com/agricidaniel/wp-mcp-ultimate.git
```

The compose file already bind-mounts `./plugins/wp-mcp-ultimate` into the container, so it
appears under Plugins in wp-admin. Activate it there.

> Requirements per the plugin: PHP 8.0+, WP 6.7+. The `wordpress:php8.3-apache` image
> satisfies both.

### 3. Issue an MCP API key

In wp-admin: **Tools → MCP Ultimate**. Generate an API key. The dashboard prints a
client-config snippet.

### 4. Register the MCP server with Claude Code

Two options the plugin supports:

- **Application Password** (simplest for local): wp-admin → Users → your profile →
  Application Passwords → add one. Use it with the plugin's REST/MCP endpoint.
- **OAuth 2.1** (what Claude Web/Mobile connectors need): the plugin bundles an OAuth 2.1
  server with PKCE + dynamic client registration.

For Claude Code, add the server to your MCP config (project `.mcp.json` or user settings)
using the snippet from step 3. Once it's listed, its tools load via ToolSearch like any
other MCP server, and I can drive the lender CPT, money pages, menus, and media directly.

> Note: Application Passwords normally require HTTPS. The compose file forces them on over
> http for `localhost` only (`wp_is_application_passwords_available` + `WP_ENVIRONMENT_TYPE=local`).
> Do not carry that override to any public host.

## After it's connected — build order

Driven via the MCP tools once step 4 lands (tracks the SEO plan Tier-1 build order):

1. Money-page templates for the 5 Tier-1 pages (`docs/SEO_PLAN.md` §3 keyword→URL map).
2. Lender records populated from `docs/LENDER_DIRECTORY.md`, left `unverified` until BCFSA-checked.
3. Self-canonical URLs + JSON-LD (FinancialService / Article / FAQPage / BreadcrumbList).
4. XML sitemap + robots served from this origin (SEO plan T2).
5. 301 map from the current Lovable URLs before any domain cutover.

## Teardown

```bash
docker compose down       # stop, keep data
docker compose down -v     # stop and wipe db + WP core volumes (fresh start)
```
