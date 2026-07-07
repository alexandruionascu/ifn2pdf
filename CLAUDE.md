# CLAUDE.md

Instructions for AI agents operating in this repository. Read this fully before running shell commands, editing files, or invoking skills.

## What this repo is

A Vite + React + pdf-lib app that renders IFN (non-bank financial institution) contract PDFs for SC DOGAR IFN SRL in Romania. The PDF pipeline replaces the legacy pdfme stack with a pdf-lib pipeline that overlays prefilled text on `public/contract-base.pdf` and stamps a SC DOGAR IFN round seal.

See `dogar_ifn_pdf_stack.md` in `.claude/projects/.../memory/` (loaded automatically) for the full pipeline shape.

## Operator identity (READ BEFORE DEPLOYING)

There are two operator tiers in this Firebase project (`dogarifn`):

| Identity | GitHub/email | Deploy access |
|---|---|---|
| **Owner** | `alexandruionascu` / `alexandruionascu.bd@gmail.com` | All three sites (live, dev, demo) — full Owner role on the project |
| **Collaborator** | `andytm07` / `andytm07@gmail.com` | **dev and demo only** — custom role `hostingDeployerDevDemo` with an IAM Condition that blocks the prod `dogarifn` site |

If the active git author is `andytm07`, or if `firebase login:list` shows `andytm07@gmail.com` as the logged-in user, you are operating as the **collaborator**. Follow the dev/demo rules below. Do not attempt to deploy to prod, modify the IAM policy, edit `firebase.json` / `.firebaserc`, or run any `firebase hosting:sites:delete` / `firebase projects:*` command.

If you are operating as the owner, full prod access is fine but still prefer the `/deploy-dev` skill for iteration and reserve direct shell prod deploys for explicit promotion.

## Firebase Hosting — three sites, one project

The project has three persistent Hosting sites. Preview channels were rejected because `--expires` caps at 30d.

| target | site ID | URL | deploy command |
|---|---|---|---|
| `live` | `dogarifn` | https://dogarifn.web.app | `firebase deploy --only hosting:live` (owner only) |
| `dev` | `dogar-ifn-dev` | https://dogar-ifn-dev.web.app | `firebase deploy --only hosting:dev` (or `/deploy-dev` skill) |
| `demo` | `dogar-ifn-demo` | https://dogar-ifn-demo.web.app | `firebase deploy --only hosting:demo` (or `/deploy-demo` skill) |

**Never run `firebase deploy` bare** — it would target all three sites including prod. Always pass `--only hosting:<target>`. The `firebase.json` file has three entries under `hosting[]`, one per target, and `.firebaserc` maps the friendly names to site IDs.

## Slash commands for deploys

Three skills live under `.claude/skills/`:

- `/deploy-dev` — builds the bundle and deploys to dogar-ifn-dev
- `/deploy-demo` — builds the bundle and deploys to dogar-ifn-demo
- `/list-sites` — read-only inventory of sites and URLs

**There is intentionally no `/deploy-prod` skill.** If the user asks to deploy to prod, refuse and route to the owner (`alexandruionascu`). The IAM Condition on the collaborator role also blocks prod deploys at the API level, but the skill-level refusal is the first line of defense.

Each skill's `SKILL.md` lists explicit guardrails (what to never run, what to do on permission errors). Read those guardrails before invoking.

## Branch conventions

- `main` — production-bound. Direct deploys to `live` or `demo` should come from here.
- `fix/*` or `feat/*` — feature branches. Deploy to `dev` for review before merging to `main`.
- Andrei's workflow: push feature branch → `/deploy-dev` → ask owner to review the dev URL → owner merges to main → demo auto-updates on next owner run of `/deploy-demo`.

## Build, test, lint

```bash
npm run build       # vite build → dist/
npm run lint        # eslint src --ext ts,tsx
npm run pdf:render  # render a sample contract to PDF for visual verification
npm run pdf:measure # measure coordinates on the contract template
npm run pdf:extract # regenerate the layout TS + basePdf binary from the source contract
```

## PDF pipeline notes (quick reference)

- The renderer is in `src/components/pdf/`. New prefilled fields must be added both to the type definition AND to the hand-typed `assets` state in `PDFFillStep.tsx` (see `dogarrenderinput_wiring_gap.md` memory).
- The Dispoziția de încasare personal-info slots stay **blank** for handwriting — only `VALOARE INCASARE` and `IN SCRIS` are prefilled (mirror of the plată sum chain). See `dogar_ifn_incasare_handwritten.md` memory.
- COMISION prefill from the base contract is **desired** — do not blank it and do not add a pdfKeys mirror. See `dogar_ifn_comision_prefill.md` memory.
- The handwriting block uses explicit `<hr>` rules at 0/5.6/11.2/16.8/22.4/28mm, NOT CSS gradients. See `dogar_garantii_ruled_lines.md` memory.
- The SC DOGAR IFN round stamp is drawn programmatically per page at x=167 y=137 w=31 h=31. The PNG must keep its alpha-transparent background. See `dogar_ifn_stamp_overlay.md` memory.

## Don't

- Don't commit `dist/`, `.firebase/hosting.*.cache`, or `.claude/settings.local.json` (Claude Code auto-regenerates it).
- Don't modify `firebase.json` or `.firebaserc` to add new targets without asking — site additions go through the owner.
- Don't run `firebase projects:*` or `firebase hosting:sites:delete` unless explicitly told to.
- Don't add `deploy-prod` as a skill, ever. Prod promotion is an owner-only workflow.