---
name: deploy-dev
description: Deploy the current code to the dogar-ifn-dev Firebase Hosting site. Use when the user (Andrei) says "deploy to dev", "push to dev", "ship to dev", or wants to test changes on the dev environment. This skill is for DEV ONLY — never use it to deploy to demo or prod.
---

# Deploy to Dev

Andrei deploys his work to the dev environment so he (and the project owner) can review it before anything goes to demo or prod.

## Steps

1. Confirm the working tree is on a branch (not detached HEAD). If on `main` or `demo`, warn the user: "Dev deploys should come from a feature branch. Want to deploy anyway?"
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy to the dev site:
   ```bash
   firebase deploy --only hosting:dev
   ```
4. On success, report the URL clearly:
   ```
   Deployed to dev: https://dogar-ifn-dev.web.app
   Cache may take a few seconds to invalidate.
   ```
5. On failure, surface the error verbatim. Common cases:
   - `Permission denied` on `dogarifn-dev` site → user's IAM role is missing. Ask the user to contact the project owner (Alexandru).
   - `Permission denied` mentioning the prod `dogarifn` site → an earlier `firebase deploy` command without `--only` was attempted. IAM blocked it correctly; nothing to fix.

## Hard guardrails

- **NEVER** run `firebase deploy` without `--only hosting:dev`. A bare `firebase deploy` targets the prod live site, which the user's IAM role explicitly blocks.
- **NEVER** run `firebase deploy --only hosting:live` or `--only hosting:demo` from this skill. Use the dedicated `deploy-demo` skill instead.
- **NEVER** modify `firebase.json`, `.firebaserc`, or `firebase` CLI config to "work around" an error. The block is intentional.
- If the user asks to deploy to prod or demo, refuse and point them to the right skill (`/deploy-demo`) or to the project owner.