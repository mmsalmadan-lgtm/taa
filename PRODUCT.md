# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the staff of مؤسسة طاء الرائدة للمقاولات العامة on the office dashboard** (`d/index.html`). When the
dashboard's needs conflict with the public site's or the forms', the dashboard wins (owner, 2026-11-09).

- Owner (Eng. Mustafa Al Madan) and admin: the whole company at a glance, then the detail.
- Finance manager, accountant: client collections and claims, client custody, supplier and subcontractor payments, cash,
  VAT, profitability.
- Procurement and equipment: material and equipment requests, purchase orders, suppliers and what is owed to them.
- Site engineers, supervisors, MEP: their own projects, requests, pours, quality of the works.
- Sales and pricing (owner, 2026-11-14): the sales person follows customers and receives approved quotes; the pricing
  officer approves quotes with the internal cost file, which sales never see.
- Subcontractors / executors: sign in for «المساعد» only (the bot as a chat inside the dashboard), never any figures.
- The office wall display: a permanent screen in the office, rotating panels, no amounts.
- Coming with the text-inbox redesign: a **foreman** role (checks a material need before the site engineer), and every
  person in charge receiving routed messages as dashboard items.

Use is **mixed**: office roles mostly at a computer, site roles mostly on a phone. Both must work fully.

Secondary audiences:
- Customers accepting a quotation on their phone (`q/index.html`): view, accept / ask for changes / decline, one-time code.
  Never any cost, margin or internal data.
- Clients, subcontractors and staff opening the bot's signed links to web forms (`f/index.html`), on a phone, from WhatsApp.
- Prospective clients on the public company site (`index.html`), judging the company.

## Product Purpose

Run a small Saudi general contractor (structural and finishing works for villas and residential buildings) from one place.
**The dashboard is the main place of work; WhatsApp is for alerts and the field** (owner, 2026-11-14): the bot collects
field facts and reminds people; the dashboard shows each person what concerns them, with the same numbers and rules as the
bot, and lets them act where the data is shown. Success: the owner can trust every figure,
and nobody has to chase anyone for what is waiting on them.

## Positioning

The dashboard is not a generic ERP. It is the working place of a workflow whose field side runs on WhatsApp, built on this company's own rules:
the bot's own queues («بانتظارك»), its approval chains, its document cycle (PO → GRN → supplier invoice → PV, receipt
vouchers RV), and the audit engine of «تدقيق طاء» running hidden inside the page so every audit figure is exactly the audit's.

## Operating Context

- Sign-in is the dashboard's own (phone + PIN after a one-time activation code), independent of WhatsApp; the bot's signed
  12-hour link still works. Phone alerts by web push (installable dashboard); «المساعد» is the bot as a chat inside the
  dashboard, so approvals and bot actions can be done from the dashboard.
- Still planned (taa-bot#25): plain-text messages routed to the person in charge.
- Sensitive changes ask for the PIN (money, approvals); some are still parked until «تأكيد» from the person's WhatsApp.
- Saudi context: Arabic, right-to-left; money in Saudi riyals with the official riyal sign; 15% VAT; tax invoices come from
  the accounting system (Qoyod), not from this product; ZATCA rules apply to invoices, not to receipt vouchers.
- Project numbers `S-yy-nnn` (structural) / `F-yy-nnn` (finishing).

## Capabilities and Constraints

- **Languages: Arabic and English** on the dashboard (owner, 2026-11-09): some staff need English (e.g. procurement). The
  switch is built (2026-11-13), chosen per device; only the interface is translated, names and data stay as written.
  Arabic stays the default and RTL.
- Static site on GitHub Pages from `main` (custom domain taaa.sa). No build step: every page is one self-contained HTML file.
- The back end is the bot (repo mmsalmadan-lgtm/taa-bot), reached over `…/bird-webhook/dash`; allowed origins are set there.
- Roles decide what each person sees; the bot re-reads person and roles on every load.
- Data shown is real company data. Never test a save against production.
- An unknown input is shown as unknown («—», «لم يُدخل»), never as 0, and a total built on it says so.
- `facebook-domain-verification` meta tag in `index.html` must stay (Meta re-checks the verified domain).
- Undecided: which parts of the forms and public site get English beyond what exists.

## Brand Commitments

- Name: مؤسسة طاء الرائدة للمقاولات العامة (Taa Al Raeda General Contracting Establishment).
- Owner's interface rules, binding: Salesforce-like cards, two per row on a phone; accounting, engineering and alert
  colour families kept apart; the official Saudi riyal sign for money; no information repeated on a card or page; finance
  lives under المالية, purchases under المشتريات; mobile first (header buttons go under the title); home is a brief
  overview only, detail opens on click; everything is edited where it is shown, no separate entry section.
- Client-facing material never shows subcontractor names or prices; subcontractors never see client prices or payment
  dates; no IBANs on public links; never mention Aramco or loans to clients.

## Evidence on Hand

- Logos: `cr-logo.png`, `vat-logo.png`; the riyal glyph embedded as the "SAR" font in `d/index.html`.
- Office address and company phone numbers (in taa-bot CLAUDE.md).
- Real operating data in production (29 projects; contracts 14,259,433.75 ﷼; collected 7,751,477.43 ﷼ as of 2026-11-09).
- No testimonials, case studies, press or client logos exist; do not invent any.

## Product Principles

1. **Trust the numbers.** One source per figure, unknown never shown as zero, estimates labelled as estimates.
2. **Decisions first, then what is missing; estimates never lead** (owner, 2026-11-14, every page and every role). Each person
   sees what needs their action before anything else, then the missing inputs that keep figures from being real, and is
   reminded until it is done. A figure built on a forecast or on missing inputs is never the first thing on a page.
3. **Act where it is shown.** No separate data-entry screens; edits and approvals happen on the item itself.
4. **Same rules as the bot.** The dashboard never computes its own version of a business rule the bot already owns.
5. **Phone and desk both first-class.** A site engineer on a phone and an accountant at a desk complete the same task fully.

## Accessibility & Inclusion

- Arabic RTL as the primary reading direction; English as a second language on the dashboard.
- WCAG AA contrast (light background only, owner 2026-11-13); touch targets at least 44 px on touch screens; labels linked to fields; status
  messages announced (established in the 2026-11-09 critique fixes).
