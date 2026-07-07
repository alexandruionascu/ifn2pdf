---
name: deploy-demo
description: Deploy the current code to the dogar-ifn-demo Firebase Hosting site. Use when the user (Andrei) says "deploy to demo", "push to demo", or wants to publish a stable build for client/stakeholder review. This skill is for DEMO ONLY — never use it to deploy to dev or prod.
---

# Deploy to Demo

Demo is a stable showcase environment for clients. Deploys here should be intentional and reviewed.

## Steps

1. Confirm the user really wants demo. This is a "client-facing" environment. If the request is exploratory, suggest `/deploy-dev` instead.
2. Confirm the working tree is on `main` (or the branch the user explicitly named). If on a feature branch, warn: "Demo typically tracks `main`. You're on `<branch>`. Deploy anyway?"
3. Build the production bundle:
   ```bash
   npm run build
   ```
4. Deploy to the demo site:
   ```bash
   firebase deploy --only hosting:demo
   ```
5. On success, report the URL clearly:
   ```
   Deployed to demo: https://dogar-ifn-demo.web.app
   Cache may take a few seconds to invalidate.
   ```
6. On failure, surface the error verbatim. Common cases:
   - `Permission denied` on `dogar-ifn-demo` site → user's IAM role is missing. Ask the user to contact the project owner (Alexandru).

## Hard guardrails

- **NEVER** run `firebase deploy` without `--only hosting:demo`. A bare `firebase deploy` targets the prod live site, which the user's IAM role explicitly blocks.
- **NEVER** run `firebase deploy --only hosting:live` or `--only hosting:dev` from this skill. Use `deploy-dev` for dev, and ask the project owner for prod.
- **NEVER** modify `firebase.json`, `.firebaserc`, or `firebase` CLI config to "work around" an error. The block is intentional.
- If the user asks to deploy to prod, refuse and route them to the project owner (Alexandru). Prod deploys are out of scope for this user.