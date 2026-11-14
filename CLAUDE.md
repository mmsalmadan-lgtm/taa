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
  q quality+defects, i inspections «الفحوصات» (insp, findings, gates, qaplan, bfqa — Phase 4), p pours, u units) · sales · rat · sys · data.
- Home = a brief overview only (owner's rule): waiting chips, KPI strip, forecast chart (`fcbox`, tips), top-3 alerts, health.
  Detail opens on click via `morePage` (fc / fund / alerts / coll / wait). Don't add long lists to home.
- Project record: header buttons (تعديل المشروع، مراحل التنفيذ), tabs inst (contracts + installments; a single contract does
  not repeat header numbers), exp, subs, docs, notes. `ptitle(p)` shows the project number badge (`.pcode`); search includes it.
- «المستندات» (`recTab "docs"`, `docsTab`): `p.docs` from the bot (RV / PO / GRN / supplier invoice / PV, newest first), filter
  chips by type (`docF`), one card each; «فتح PDF» → `openDoc` → `api({op:"doc", t, id, i})` → short-lived signed URL (the
  window is opened inside the click so it is not blocked; blocked → same tab). No `p.docs` = bot not yet deployed → a note.
- «المبيعات» (`salesView`, when `D.leads` comes from the bot; admin/pricing): KPI strip, status chips (`leadF`, `LST`), one card per
  quote request (`leadCard`): draft packages with net margin (<8% red, <10% amber), the 950–1,050 competitors' check, buttons for
  the draft quote / sales file / cost file (PDF, Excel) / quote sent and, under «التفاصيل والمخططات», each customer drawing (`openDoc` t lf/lq/ls/lc/lcx/lsent),
  facts, conflicts, open points, edit notes, log. Approval and sending stay in the bot card. Extra works follow as before.
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
- Touch targets ≥44px on `pointer:coarse`. Run `npx impeccable detect --json d/index.html` before a PR (must come back `[]`).

## Visual language «طاولة الرسم» (redesign 2026-11-13, owner asked for one coherent language)
- Light only (owner: light background). Cool concrete page `--bg #F1F3F4`, white surfaces, the company navy `#1D2533` for text
  and actions (`--ui`), the logo red `--brand #C62026` only in the mark. Colour = meaning: ledger green, blueprint blue,
  red/amber alerts. `--faint` is the lightest text allowed (4.5:1 on the page).
- Type: Readex Pro (`--f-disp`) for titles and large figures, IBM Plex Sans Arabic (`--f-text`) for reading; both start with
  the "SAR" face so the riyal sign renders everywhere.
- Shell: `<aside class="side">` holds the header and the nav. ≥1080px it is a sticky side navigation (groups «الأقسام» /
  «الإدارة» from `TABS[].g`, icons from `ICO`); below that it is `display:contents` → top bar + sticky sideways pill strip.
- Page head `page(icon, title, sub, fam)` → `header.ph` with the family colour as the rule beside the title (title may be a
  node, e.g. the project number badge). Sub-tabs are a segmented control; `.panel` is a separate surface under it.
- Home: `hero()` (date + greeting only, no figures), `startHere()` («ابدأ من هنا»: the waiting items in order, cash first while
  it is not entered), `ledger(K)` (the same KPI list grouped يدخل / يخرج / النقد), the forecast, then alerts + health.
- Projects: `.finder` (one search field + filter chips with counts) and a live result count.
- Motion: `main.enter` fades each new place in (set in `draw()` when the place changes; focus moves to `main`); the forecast
  bars rise once per session (`.intro`); dialogs are a bottom sheet on phones; buttons answer presses. All off under
  `prefers-reduced-motion`.
- Sign-in: brand above one card; activation shows numbered steps and a progress bar (`.auth.stepped`, not `.steps` — that
  class is the home step list).
- Verified on this redesign: every thousand-separated figure on home, projects, finance, subcontractors, a project's payments
  and the funding page is identical to the previous version, and the edit-in-place saves (stages, installment, contract, cash
  and fixed costs) produce the same audit state.

## English (2026-11-13)
- «English / العربية» button in the header (and on the sign-in card); the choice is kept per device (`localStorage taa.dash.lang`).
  English sets `<html dir="ltr" lang="en">`; layout uses logical properties (`text-align:start/end`, `inset-inline-*`).
- Only the interface is translated: `EN` (Arabic → English; `{n}` = a number/amount, `{x}` = any text such as a name) applied to
  every text node and placeholder/aria-label/title by a MutationObserver (`trTree`), the Arabic kept on the node and put back
  when switching back (`unTree`). Names, notes, installment names and other data stay as written.
- A new Arabic UI string shows in Arabic in English mode until it is added to `EN`. To find them: render every view with
  `taa.dash.lang=en` and list text nodes still containing Arabic (names and notes are expected to stay).
- Never put program logic on displayed text (option values, checks): the text may be English.

## Acting from the dashboard (2026-11-13)
- «بانتظارك» rows carry the bot's row ids (`sec("wait").data.ids`): each card is a button that opens `openChat(id, title)`, a sheet
  that talks to the bot through `POST op chat` — bot messages as bubbles (WhatsApp *bold* rendered, attachments as links),
  its buttons, list options and form links as controls, a text box for answers it asks for. A 428 `{pin:true}` asks for the PIN
  and resends. Closing the sheet after any action reloads the dashboard (`load(true)`). The rules live in the bot only.

## «المساعد» (2026-11-13)
- Tab `bot`: the bot as a page — `chatPanel("قائمة", {page:true})` starts at the bot's menu, kept in `ASSIST` while you move
  between pages; «القائمة من البداية» restarts. The same `chatPanel` is the sheet a «بانتظارك» item opens (`openChat`).
- 📎 sends a photo/video/PDF (`op chat {file}`); photos over 1.5 MB are shrunk on the device (long side 2000 px, JPEG 0.85).
- Executors sign in for this only: GET returns `chatOnly:true` → only the «المساعد» tab, no figures, office footer hidden.

## Phone alerts (web push, 2026-11-13)
- Header button «التنبيهات» → `pushDialog()`: turn on (`Notification.requestPermission` straight from the tap → `op push_key`
  → `pushManager.subscribe` → `op push_sub {sub, ua}`), test (`op push_test`), turn off (`push_unsub` + unsubscribe). iPhone
  without home-screen install gets the add-to-home-screen steps (`.isteps`); blocked permission gets the settings steps.
  `pushSync()` re-sends the subscription once a day per device; signing out unsubscribes the device.
- `d/sw.js` (scope /d/): shows the alert (icon-192, badge-96, tag "taa"), a tap focuses an open dashboard (postMessage
  `{go:"bot"}`) or opens `/d/?go=bot`. It caches nothing. `d/manifest.webmanifest` + `apple-touch-icon.png` make the
  dashboard installable (iOS 16.4+ needs that for alerts). Home-screen apps on iPhone have their own storage → sign in again
  there with the PIN.
- «المساعد» first asks `op inbox` (messages the bot sent while alerts were on, shown once, with their buttons) and shows the
  menu only when there is nothing new; each later visit appends anything new (`ASSIST.pull()`).
- Checked: `scratchpad rd/push.cjs` (mocked API, subscribe stubbed — headless Chromium has no push service) and a real
  push event delivered to sw.js through CDP (`ServiceWorker.deliverPushMessage`, needs `chromium.launch({channel:"chromium"})`).

## Phase 1: sources, data completion, recorded money (2026-11-13)
- Home ledger rows carry `est` (cash / collections / forecast / profit / vat): when `D.prov.missing[est]` is not empty the row shows
  «تقديري — ينقصه N بنود» (`.estm`, opens `more("dq:<cat>")`) and a warn flag it covers is not repeated. Under the ledger,
  `provBox()` («مصدر الأرقام ودقتها», a `<details>`): per figure its source and freshness (audit last save, Qoyod last sync, cash
  book), actual vs forecast, reconciled or not, and what it lacks. Source parts are joined by « · » so each part translates.
- «اكتمال البيانات» = `more("dq")` / `dqPage`: chips (not done / I can act / done), one card per item (kind, title, status, owner
  role), `dqDialog` (detail, evidence, owner names, affects, status select + note when `it.can`; admin sets the custody fee rate),
  `dqAdd` (admin/accountant), `histDialog(tbl,id)` (op history). The step «بيانات ناقصة أو غير مطابقة…» sits in «ابدأ من هنا».
- `edSave`: a 428 `{pin, reason, changes}` opens `moneyConfirm` inside the edit sheet (the changes, the reason when correcting, the
  PIN; the sheet's own buttons hidden meanwhile); 401 `{badPin}` asks again keeping the reason; «رجوع» cancels with nothing saved.
- The chat treats 401 `{badPin}` as a wrong PIN (asks again), not as a lost session.
- Checked with `scratchpad rd/p1.cjs` (mock `merge/dash_p1.json`).

## Phase 2: purchases and the budget (2026-11-13)
- The purchases section (bot `dash.ts`) now carries KPIs «التزامات مفتوحة», «مستحق للموردين», «طلبات باستثناء على الميزانية» and a
  «الميزانية» column (exception / within budget with what is left / no approved budget); rendered by the generic `cards()`.
  New statuses: partial (استلام جزئي), cancelled, closed (مغلق ✓). Checked with `scratchpad rd/p2.cjs` (mock `merge/dash_p2.json`).

## Phase 3: the home page answers five questions (2026-11-14, corrected after the owner's review)
- With `D.fc`, `D.home`, `D.fcMe` (money roles) `home()` → `home3()`: «ابدأ من هنا» = decisions ranked by money × urgency, the data
  queue step and «تحديث توقعات المشاريع» (`more("fcq")`); `answers()` (cash per scenario, risk by class, documented delays vs
  unverified progress vs missing reports, stuck items — forecast tiles carry «تقديري»); `w13Box()` (base scenario bars; the forecast
  page adds evidence-only dots and a scenario switch `FCS`); the ledger from `homeK(AUD)` with the base-scenario lowest and the
  estimated projects' profit; `provBox()`.
- Pages `p3Page`: fc13 (scenarios table, basis share bar `.bsb`, first-shortfall causes, weeks, receipts by class with entitlement/
  overdue/claim/evidence, payments with basis — spread work summed per project, excluded, missing → dq, assumptions, «إعدادات
  التوقع» `setDialog` → op fc_set), risk (one section per class with evidence and limits; how remaining cost was estimated and the
  benchmark's projects), behind (delays / unverified / no plan / reporting gaps / bottlenecks), blocked, decide, fcq (completion queue).
- Project overview `costCard()`: revenue, actual (parts), unpaid, committed (incl. blank sub agreements), uncommitted or «غير مقدّرة»,
  EAC («على الأقل» when a floor), profit; budget original / approved revisions / current + pending revision (approve/reject for an
  admin who did not ask: `budgetDec`); last forecast update; classes with evidence; buttons «تحديث التوقع» (`revDialog`: items
  «الوصف | الكمية | الوحدة | السعر» or one amount + basis, execution dates, payment days, collection date + evidence per instalment,
  reason, owner, review date → op fc_rev with `base` = docV) and «طلب تعديل الميزانية» (`budgetDialog` → op budget_rev).
- Checked with `scratchpad rd/p3.cjs` (mock `p3/dash_p3b.json` from `p3/gen2.mts`) at 390/1280/EN — no errors, no horizontal scroll;
  `rd/p3rev.cjs` fills and saves the revision sheet (mocked API) and checks the request body.

## Phase 4: inspections (2026-11-14)
- Sub-tab «الفحوصات» under «التنفيذ والجودة»: the bot's sections `insp`, `findings`, `gates`, `qaplan`, `bfqa`, drawn by the generic
  section cards (no special code). EN strings added. Checked with `scratchpad rd/p4.cjs` (mock `p4/dash_p4.json` from `p4/gen.mts`).
- After the owner's review: home ledger profit says how many projects rest on an unvalidated company ratio (`F.totals.benchmark`, left
  out of the total); risk page class `benchmark`; the forecast's «خارج التوقع» shows each excluded project's uncommitted amount.

## Consolidated spec stage 2 (2026-11-14)
- Home ledger profit row = «ربح المشاريع المشمولة فقط» with «N من M مشروعاً — ليس ربح المحفظة» (`F.totals.coverage`). Risk page: per company
  ratio its sources with completeness / comparability (admin «تأكيد» → `benchSrcDialog` → op `bench_src`), the minimum of sources, and
  «ما يشمله مجموع الربح المتوقع» (included, each group left out, contract evidence). fc13: a stress row under each scenario
  (`x.stress`) and «تعرّض غير مجدول» (`C.unscheduled`). «إعدادات التوقع» has `benchMin`. Checked with `rd/p3.cjs` on `p4/dash_s2.json`.

## Consolidated spec stages 4–5 (2026-11-14)
- Nav «المبيعات والعقود» (`TABS` sales, ids changes/leads/estimates/quotes/ccontracts/variations) with sub-tabs `SCTABS` / `SCT`
  (الفرص والعملاء = `salesView` · التسعير · عروض الأسعار · العقود · الأعمال الإضافية), drawn by `salesContracts(m)` from the bot's
  register sections (generic cards). Admin: «صلاحيات الاعتماد والموافقة الإلكترونية» → `salesSetDialog()` (prefilled from `D.salesSet`;
  sends only what changed) → op `sales_set`. Approval and sending stay in the bot's cards.
- Nav «المستندات والسجلات» (`TABS` docs, ids docreg/doccomplete/docmatrix, `ICO.docs`).
- Project «المستندات»: FILE cards show the review status; an admin (not the uploader) presses «مراجعة» → `reviewDoc(d)` → op
  `doc_review` (contract: «موقّع من الطرفين وكامل»). Upload adds event date and external reference.
- `q/index.html`: the CUSTOMER's quotation-acceptance page (`POST …/bird-webhook/accept`, token from the hash, then removed from the
  address bar): view → choice (accept / changes / decline) → name, capacity, consent tick, one-time code → receipt. Riyal symbol via
  the SAR font (copied from d/). No cost, margin or internal data on it.
- Checked with `scratchpad rd/s4.cjs` (mock `p4/dash_s4.json` from `p4/gen_s4.mts`, 390/1280/EN, no errors, no horizontal scroll, EN
  strings complete except names/data), `rd/ss.cjs` (settings dialog prefill + body), `rd/q.cjs` (acceptance flow, wrong code, missing
  consent, voided link, missing token).

## Consolidated spec v2 (15 Nov 2026): navigation and actions on records
- Navigation per spec §2: المبيعات والعقود · مقاولو الباطن والتعاقدات (`subc`, `SUBTABS`/`SUBT`, `subcView`: subreg, opps, offers, awards, and the
  certificates subk/certs as «المستخلصات والأداء») · المشتريات والمواد (`BTABS`: matreq, reqs+purchases, log, ownmat, suppliers) · التنفيذ والجودة
  (`STABS`: programme, lookahead, dailyplan+teams, ptasks+constraints, inspections, dreports, defects «التسليم والضمان», quality, pours, units) ·
  المالية ومراقبة التكلفة · المستندات والسجلات.
- Actions drawn from the bot (`cards()`): `s.data.add` → buttons above the cards; `s.data.rows[i].acts` → buttons in the card (`.cacts`);
  `actForm(s, def, row)` builds the form from `def.fields` (text/area/number/date/select/multi/bool/lines with `cols` and `opts`), prefills
  `row.data`, posts `op act {sec, act, row, data, opId, pin?}`; 428 `{pin}` asks the PIN; success → toast + `load(true)`. No rules here.
- Checked with `scratchpad rd/s6.cjs` (mock `p6/dash_s6.json` from `p6/gen_s6.mts`: the bot's own section builders on controlled test records)
  at 390/1280/EN: every new sub-tab, no horizontal scroll, an action form submitted (body checked). The only console errors come from the
  mock answering `op purchases`/`op matbudget` with `{ok:true}` (pre-existing boxes that expect real data).

## Project Command Center, rented labour, wall display (spec 14 Nov 2026, stage 1)
- Nav «مركز القيادة» (`TABS` cmd, shown when `D.cmd`; `cmdView`, sub-tabs `CTABS`/`CT`): العمليات الآن (`cmdNow`: counts, `syncBar` — field /
  figures / Qoyod times kept apart, old or missing says so in words —, interventions `ivCard`, the map note, project cards `cprojCard` →
  `cprojDlg`), خطة الأسبوع (`cmdWeek`, classes `WCLS`), بدء المشاريع (`cmdStarts`/`startCard`, checks ✓ ✗ ?), التنفيذ والتحصيل (`cmdColl`:
  `protPanel` with the 28-day `nearChart`, the ladder `ladder()`, queues of `rcvCard`; what is unknown on every receipt is said once),
  اجتماع الإدارة (`cmdReview`, an agenda). Statuses carry a glyph AND a word (`stBadge`, `glyph`), never colour alone.
- Interventions act through the generic `actForm` with the pseudo-section `ivSec()` = `{id:"cmdiv", data: D.cmd.iv}`; a derived item offers
  «متابعة كتدخل» (the «new» form prefilled from the record). Amounts appear only when the bot sent them (`cash.protection.floor` present).
- Nav «الموارد والعمالة» (`resView`, `RTABS`/`RT`): the bot's lsup/lwk/lreq/ltsh/linv sections, generic cards and actions.
- Wall display: a GET answer with `display` (role «display») → `wallStart` (body.wallmode, no nav) → `wallView`: rotating panels
  (`wallPanels`, 20 s, pause / next, progress rule off under reduced motion), open interventions always on the side, refresh every 5 min
  (`wallRefresh`), a stale banner when the data is older than 15 min, a screen wake lock. The bot strips amounts; the page shows none.
- `actForm`: a required select with no value starts on «— اختر —» (no silent first-option default).
- Checked with `scratchpad rd/cc.cjs` (mocks `p7/dash_cc.json`, `dash_cc_eng.json`, `dash_wall.json` from `p7/gen_cc.mts`: the bot's own
  command.ts/labour.ts on controlled records): 390/1280/EN, engineer view has no riyal sign, wall 1920×1080 + phone, rotation and pause,
  an intervention action body, no horizontal scroll, no console errors.

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
- Custody fee %: set by management from the data-completion list (no fee until then); VAT on custody purchases (ask Amr).
- 8 projects have no contract date (year 2025 assumed for their numbers).
- Ahmed Zaki (S-25-003): see the reconciliation item in «اكتمال البيانات» (audit 600k vs Qoyod 450k).
