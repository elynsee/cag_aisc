# cag_aisc — AI Staff Claims

Interactive prototype of the **CAG Claims landing / start screen**, built against the
Runway Design Language System (Admin profile).

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## Stack

React 18 + TypeScript + Vite — the stack the DLS specifies for CAG internal admin
screens (usage guide §9.1). Lato is bundled via `@fontsource/lato` rather than
fetched from a CDN, so the sole DLS typeface renders offline.

## What is interactive

| Flow | Behaviour |
| --- | --- |
| Upload a receipt | Click or drag & drop. Type and size are validated before upload; states are uploading / uploaded / failed / cancelled with Cancel, Retry and Remove recovery actions. A completed upload raises a draft claim. |
| Claim without a receipt | Opens a declaration form — category, amount, reason. Enforces the 50.00 SGD no-receipt cap. |
| Describe your claim | Free-text entry parses out an amount and raises a draft claim. |
| Ongoing claims | Rows expand in place to a detail panel. Blocked claims carry the field that unblocks them; sending an update moves the claim to Submitted. Claims can be withdrawn until Finance approves them. |
| Pending trip claims | Add Trip Expense opens an inline form (leg + amount) that reconciles the leg and moves the budget bar. View Trip Details reveals approver, policy cap and approval route. |
| Header | Account dropdown (User Settings, Logout) closes on outside click or Esc. Navigation collapses to a hamburger menu at mobile. |

## DLS conformance

- **Tokens** — every colour, spacing, radius, shadow and focus-ring value lives in
  `src/styles/tokens.css`, copied verbatim from the skill. No component declares a
  raw hex or px value.
- **Typography** — the composite text styles of SKILL.md §6 are utility classes in
  `src/styles/typography.css`. `t-h5-admin` carries the Admin profile's Lato Black
  24 header override.
- **Grid** — structural CSS Grid at 12 / 6 / 4 columns. Sections span desktop
  col 3–10, tablet col 1–6, mobile col 1–4; the desktop centring is a symmetric
  two-column offset, not a margin. Column mappings are documented at the top of
  `src/App.tsx`.
- **Components** — Buttons, Status Chips, File Upload, Web Header, Text Input,
  Currency and Dropdown Input follow their specs in
  [`cag-euxui/runway-md-components`](https://github.com/cag-euxui/runway-md-components);
  each component file cites the rules it implements.
- **Icons** — inline SVG only, no emoji anywhere in the UI.

### Known prototype gap

The File Upload spec requires progress to reflect actual upload status rather than a
simulation. There is no backend here, so progress is driven by a local timer —
replace `startUpload` in `src/components/FileUpload.tsx` with a real XHR/fetch
progress handler when wiring this to the claims service.
