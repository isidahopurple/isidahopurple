# Is Idaho Purple?

**https://isidahopurple.com** · [Español](https://isidahopurple.com/es/)

An open-source voter site for Idaho's **Nov 3, 2026** election. It was built by one Idahoan, with no donations and no campaign ties.

- **10 steps, one button each.** The home page is a roadmap. Check your registration, register, get a mail ballot and find your polling place, all through the official VoteIdaho tools. Then see what's on your ballot, plan your vote, and bring three friends. Steps check themselves off on your phone.
- **Every race on the ballot:** statewide, federal, and every Ada County legislative seat, plus close districts elsewhere. Each has candidates, one sourced quote per candidate, polls with their sponsors, and past results.
- **A stated experiment.** Our hypothesis: Idaho is more competitive than it looks if non-Republican voters team up behind the one candidate in reach in each race. The [method](https://isidahopurple.com/experiment#method) is published, and every pick follows it or is a written exception.
- **Neutral** explainers for the 4 ballot questions.
- **Address → district lookup** (US Census geocoder; nothing stored).
- **"Count me in" tally**, email-verified and privacy-first: only a keyed hash is stored. It offers optional deadline reminders, and everything is deleted after the election.
- **English and Spanish.** A share image for every page. Phone-first, fast, no cookies.

## Fork it for your state
It took a few days and costs about $10 (a domain). See **[docs/FORKING.md](docs/FORKING.md)**.

## How it works
| Part | Tech |
|---|---|
| Pages | [Astro](https://astro.build), static, in `src/` |
| Facts | YAML in `data/idaho/`, validated by `src/content.config.ts`. **Every fact has a source URL.** |
| Hosting | Cloudflare Workers static assets (free) |
| Lookup, tally, reminders | A small Cloudflare Worker (`worker/`) with a D1 database, Turnstile and Resend |
| Share images | `assets-src/` (AI background art, exact text drawn by code) |

```sh
npm install        # Node 22+
npm run dev        # local site
npm run build      # production build (fails on bad data)
```

## Found an error?
Every page links its sources. If something's wrong, especially a date or deadline, [open an issue](../../issues) or email contact@isidahopurple.com. Pull requests are welcome. Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) first; every quote needs a URL.

## License
- **Code:** MIT (`LICENSE`).
- **Original text and data:** CC BY 4.0.
- **Quotes** belong to the people quoted and link to their sources.

*Made and paid for by Ronald Baird, Idaho. Not authorized by any candidate or candidate's committee. No donations accepted.*
