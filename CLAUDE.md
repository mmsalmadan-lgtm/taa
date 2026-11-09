# taaa.sa — context for Claude Code

Static site of مؤسسة طاء الرائدة للمقاولات العامة (owner: Eng. Mustafa Al Madan). GitHub Pages publishes `main`
(custom domain `taaa.sa`, file `CNAME`) about 90 s after a merge. No build step: every page is one self-contained HTML file.
The bot (repo mmsalmadan-lgtm/taa-bot) is the back end; read its CLAUDE.md for the data model and business rules.

## Layout
- `index.html` — public company site.
- `f/index.html` — the bot's web forms page (`FORM_PAGE` = https://taaa.sa/f/), opened from signed WhatsApp links.
- `d/index.html` — «لوحة متابعة طاء», the office dashboard (the main work here).
- `d/audit.html` — the old «تدقيق طاء» audit app's code with a data shim. It is NOT shown to users: the dashboard runs it in a
  hidden iframe (`audit.html?ro=1#<token>`, `?ro=1` makes its `set()` a no-op) and evaluates `SNIP` (model(), fcChart) inside
  it to get every audit figure (`AUD`: per-project P keyed by project name, forecast FC, alerts F, fund…). Change its maths
  only on purpose; it is the source of the forecast chart and alerts.

## API (bot edge function)
`API = https://zkbwrgulnsycqqfbwkee.supabase.co/functions/v1/bird-webhook/dash`, header `x-form-token` = the person's signed
12-h link from the bot menu (kind `dash`). GET → sections + projects for his roles. POST ops: `reg` / `save` (data panel,
parked until «تأكيد» in WhatsApp, suppliers excepted), `audit` (load audit state + `at`), `audit_save` (`state`, `base` =
the `at` it was loaded from; a newer save → **409**, the page drops its copy and asks to reopen). Allowed origins are in the
bot's `ORIGINS` (taaa.sa).

## Dashboard structure (d/index.html)
- `TABS`: home · proj (projects) · money «المالية والمحاسبة» (`MTABS`: rcv receipts+claims+`dueBlock`, cus custody, subs,
  cash `cashBox`, prof `profitCards`) · buy «المشتريات» (`BTABS`: req, log, sups `supsBox`) · site «التنفيذ والجودة» (`STABS`:
  q quality+defects, p pours, u units) · sales · rat · sys · data.
- Home = a brief overview only (owner's rule): waiting chips, KPI strip, forecast chart (`fcbox`, tips), top-3 alerts, health.
  Detail opens on click via `morePage` (fc / fund / alerts / coll / wait). Don't add long lists to home.
- Project record: header buttons (تعديل المشروع، مراحل التنفيذ), tabs inst (contracts + installments; a single contract does
  not repeat header numbers), exp, subs, docs, notes. `ptitle(p)` shows the project number badge (`.pcode`); search includes it.
- «المستندات» (`recTab "docs"`, `docsTab`): `p.docs` from the bot (RV / PO / GRN / supplier invoice / PV, newest first), filter
  chips by type (`docF`), one card each; «فتح PDF» → `openDoc` → `api({op:"doc", t, id, i})` → short-lived signed URL (the
  window is opened inside the click so it is not blocked; blocked → same tab). No `p.docs` = bot not yet deployed → a note.
- Project numbers: `S-yy-nnn` structural / `F-yy-nnn` finishing (e.g. S-25-003), made by the bot (`core/projcode.ts`).

## Editing in place (no separate entry section — owner's rule)
All audit data is edited where it is shown: `editForm(title, build)` (fields text/num/select/area/date/head; check, save, del)
→ `edLoad()` / `edSave()` via `api({op:"audit"|"audit_save"})`. Find the audit project with `aProj(S, p)` (by `p.aid`, name as
fallback). Constants: `ELEMENTS`, `EXPC`, `EL_STATES`, `INST_ST`, `WHEN`. The bot writes each save back into project.fin,
suppliers and settings.finance.

## Owner's UI preferences
Salesforce-like cards, 2 per row on a phone · accounting colours (`--acc*`), engineering colours (`--eng*`), alert colours kept
apart; `CATC` for expense categories · official Saudi riyal symbol (SAR font, U+20C1) for money · no information repeated on a
card or page · finance things live under المالية, purchases under المشتريات · mobile first (header buttons go under the title).
- An unknown input is «—» with «لم يُدخل», never «0 ⃁»; a total built on it says so (e.g. «الفائض قبل إضافة النقد» while
  `AUD.cashDone` is false — the audit counts cash as entered only when it is > 0). Cash on home comes from the audit (`A.cash`),
  the same figure as the funding page and the forecast.
- Navigation is in the browser history (`navSync` after every `draw`, `popstate` restores; same URL because the hash is the
  token): the phone's back gesture goes one step back. An open dialog is its own step (wrapped `showModal`/`close`).
- Colours on accent surfaces use `--on-acc` (white in light, dark ink in dark mode); inputs use `--field-in` (≥3:1). Touch
  targets ≥44px on `pointer:coarse`. Run `impeccable detect --json d/index.html` before a PR (side-tab is a sanctioned ignore).

## How to change and verify (the owner expects Claude to check its own work)
1. `git fetch && git checkout -B <branch> origin/main` (always from a fresh main — PRs are squash-merged).
2. Test locally: `python3 -m http.server 8765` in the repo + Playwright (Chromium is pre-installed), routing the API to mock
   `dash.json` / `prod_state.json` captured from production. Check phone width (390 px) and every tab you touched; read the
   console for errors. Never test a save against production.
3. PR via `gh api` → squash merge → wait ~90 s → fetch `https://taaa.sa/d/index.html` (from Supabase `pg_net` when the shell
   can't reach it) and confirm the new code is live; then compare the totals on the page with production data.
Known good totals (2026-11-09): contracts 14,259,433.75 · collected 7,751,477.43 · due now 201,663.50.

## Open items
- «المستندات» tab and the bot behind it are live (2026-11-09; bot ebed7cd deployed). It lists documents issued from then on;
  older PO / GRN / PV have no stored PDF. Not yet checked with real data or against the known-good totals (needs a dash link).
- GET /dash is slow (~25 s) — cache or trim.
- Data still missing in the audit: salaries/fixed costs, input VAT and paid VAT (VAT due is inflated), petty-cash balance,
  existing client custody deposits.
- To confirm with the owner: custody fee % (10% default), VAT on custody purchases (ask Amr).
- 8 projects have no contract date (year 2025 assumed for their numbers).
- Ahmed Zaki (S-25-003): 150k collected but not invoiced in Qoyod.
