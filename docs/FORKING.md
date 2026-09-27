# Fork this for your state

This site was built for Idaho's Nov 3, 2026 election in a few days, by one person with an AI assistant, for about $10. You can do the same for your state. This guide walks through it.

**What you get:**
- a phone-first "10 steps to vote" home page
- a page for every race, with sourced quotes, polls and past results
- neutral ballot-measure explainers
- a district lookup (address → legislative district, county, US House district)
- an optional email-verified "count me in" tally, with deadline reminders
- share images for every page
- English and Spanish

**What it costs:** a domain (about $10 a year). Cloudflare, Resend, GitHub and Astro are free at this scale.

## Before you start: decide what your site is
This site states a hypothesis and makes picks with a published method (`docs/CONTRIBUTING.md`). You can:
- **keep that model**, which means writing your own hypothesis and method;
- **make a neutral voter guide**, by deleting `/experiment`, the picks and the tally; or
- **do anything in between.**

Whatever you choose, **say it plainly on the site** and put your real name on it.

**Check your state's election law before you publish:**
- disclosure and attribution rules for political websites
- independent-expenditure reporting thresholds
- ballot collection laws
- any rule on "promises or favors" for voting

Idaho's notes are in `docs/IDAHO-LEGAL-NOTES.md`; use them as a list of questions to answer for your state. This guide is not legal advice.

## 1. Copy the repo
Click **Fork** on GitHub, or use the template. Then:
```sh
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>
npm install          # needs Node 22+
npm run dev          # http://localhost:4321
```

## 2. Replace the data (the part that matters)
Everything factual lives in `data/idaho/`. Copy it to `data/<state>/` and change `STATE` at the top of `src/content.config.ts`.

| File | What it holds |
|---|---|
| `election.yaml` | Every date, deadline, ID rule and official link, each with a source URL. This drives `/vote` and the home-page buttons. |
| `races/*.yaml` | One file per race: candidates, one quote each, polls, past results, the pick and its reasoning. |
| `measures/*.yaml` | Neutral ballot-measure summaries. |

The schema in `src/content.config.ts` validates everything, and `npm run build` fails if a file is wrong. Text fields can be plain English or `{ en, es }`.

**Rules that kept this site trustworthy** (details in `docs/CONTRIBUTING.md`):
- **Every fact has a source URL.** Official sources come first.
- **Quotes** are real, dated and linked, and each is one the candidate would pick themselves.
- **Anything unconfirmed goes in `unverified:`.** Never guess.
- **A human checks every date on the "how to vote" page.** A wrong deadline can cost someone their vote.

## 3. Replace the state-specific wording
Search the code for "Idaho," "Ada" and "Oct 23." The main places:

| File | What's there |
|---|---|
| `src/i18n/ui.ts` | Site name, **attribution line**, contact email, repo URL, deadline banner |
| `src/views/IndexPage.astro` | The 10-step home page. The step text mentions dates and your county. |
| `src/components/Purple.astro`, `src/components/PowerBill.astro` | The experiment page's hypothesis, statistics and local issue. Replace them with your own sourced facts or delete them. |
| `src/views/AboutPage.astro`, `src/views/ExperimentPage.astro`, `src/views/PrivacyPage.astro` | Who you are, your method, and your privacy promises |
| `worker/pledge.js` | Your state's county list, the FIPS code in `worker/index.js`, and the confirmation email wording |
| `worker/reminders.js` | Reminder dates and wording. Keep them in step with `election.yaml`. |
| `assets-src/make_cards.py` | Text on the share images |
| `astro.config.mjs` | Your domain |

## 4. Hosting on Cloudflare (free)
1. Buy a domain (Cloudflare Registrar sells at cost), or point an existing one at Cloudflare.
2. `npx wrangler login`
3. In `wrangler.jsonc`, change the Worker `name`, the `routes` (your domain) and the preview hostname.
4. Create the databases, put their IDs in `wrangler.jsonc`, and run the migrations:
   ```sh
   npx wrangler d1 create <name>
   npx wrangler d1 create <name>-preview
   npx wrangler d1 migrations apply <name> --remote
   npx wrangler d1 migrations apply <name>-preview --env preview --remote
   ```
5. `npm run deploy:preview` publishes a review copy with a `/review` checklist and a "don't index" tag. `npm run deploy` publishes the real site.

## 5. The "count me in" tally (optional)
It needs three secrets. None of them go in the code.
1. **Resend** (free, 100 emails a day): add your domain (Resend can set up Cloudflare DNS for you) and create a *sending-only* API key.
   `npx wrangler secret put RESEND_API_KEY` (and again with `--env preview`)
2. **Cloudflare Turnstile** (free bot check): add a widget for your domain.
   - Put the **site key** in the `build` scripts in `package.json` (`PUBLIC_TURNSTILE_SITEKEY=...`).
   - `npx wrangler secret put TURNSTILE_SECRET`
3. **A signing secret:** `openssl rand -base64 32 | npx wrangler secret put HMAC_SECRET`

Until all three exist, the form shows "coming soon."

**Privacy design:**
- The tally stores only a keyed hash of each email, the county and the day.
- Real addresses are kept only for people who ask for reminders.
- Everything is deleted automatically after the election (`DELETE_ON` in `worker/reminders.js`).

**Email in and out:** Cloudflare Email Routing (free) forwards `contact@yourdomain` to your inbox.

## 6. Share images
`assets-src/gen_art.py` generates background art with Google's Gemini API. Rules for the art:
- no text
- no people
- **never candidates' faces**

`assets-src/make_cards.py` then adds your exact text on top. That way AI never writes a date that voters rely on. Re-run `make_cards.py` whenever race names change. You can also skip Gemini and use any photo you have rights to.

## 7. Before you launch
- **Have a second person read `/vote` against the official sources.**
- **Test the whole tally on a phone:** sign up, click the email link, see "✓ Counted."
- **Check the share preview** by pasting your link into a text message.
- **Keep secrets out of git:** `.dev.vars*` and `.env` are already in `.gitignore`.

## Questions, fixes, ideas
Open an issue or a pull request. If you launch a site for your state, open an issue with the link, and we'll list it in the README.
