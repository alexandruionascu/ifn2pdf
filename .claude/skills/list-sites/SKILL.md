---
name: list-sites
description: List the available Firebase Hosting sites for this project and their current deploy URLs. Use when the user (Andrei) asks "what sites do I have?", "where is this deployed?", or "show me the URLs".
---

# List Hosting Sites

Quick reference for the three environments in the dogarifn Firebase project.

## Steps

1. List the sites:
   ```bash
   firebase hosting:sites:list --project dogarifn
   ```
2. Report the table back to the user, with a one-line note about who can deploy where:

   | Site ID | URL | Who can deploy |
   |---|---|---|
   | `dogarifn` (prod / live) | `https://dogarifn.web.app` | Project owner only (Alexandru) |
   | `dogar-ifn-dev` | `https://dogar-ifn-dev.web.app` | Andrei (via `/deploy-dev`) |
   | `dogar-ifn-demo` | `https://dogar-ifn-demo.web.app` | Andrei (via `/deploy-demo`) |

3. Remind the user: prod is intentionally not deployable from this machine. If they need a prod change, route to the project owner.

## Hard guardrails

- This skill is read-only. **NEVER** run any `firebase deploy`, `firebase hosting:channel:*`, or `firebase hosting:sites:delete` from this skill.