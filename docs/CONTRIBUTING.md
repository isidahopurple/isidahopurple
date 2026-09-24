# Contributing data

Every page on this site is rendered from YAML in `data/idaho/`. The schema is `src/content.config.ts`; `npm run build` fails if a file doesn't match it.

## The rules
1. **Every fact has a source URL.** Prefer official sources (voteidaho.gov, sos.idaho.gov, adacounty.id.gov, legislature.idaho.gov, idaho.gov), then established newsrooms (Idaho Capital Sun, Idaho Statesman, Boise State Public Radio, KTVB, Idaho Education News, BoiseDev, AP), then candidate websites for their own words.
2. **Quotes are real, dated, linked and in context.** One per candidate. Pick the quote the candidate would choose to represent themselves, not a gotcha. Republicans get a fair quote too. Set `verified: true` only if you read the exact words on the source page. A search-result snippet is `verified: false`.
3. **Don't guess.** If you can't confirm something, leave it out or add it to `unverified:` in plain words so a person can check it.
4. **Neutral voice** in `bio`, `controls` and measure summaries. Opinions live only in `pick.reasoning` and `scenarios`, and they follow the published method.
5. **Dates** are `YYYY-MM-DD` strings. Percentages are plain numbers (`37`, not `"37%"`).
6. **Party codes:** R, D, I (independent), L (Libertarian), C (Constitution), NP (nonpartisan), Other.

## The method (how picks are made)
Hypothesis: Idaho is more competitive than it looks if non-Republican voters consolidate behind the one candidate in reach in each race.

1. If there is a recent **independent** poll (sponsor not a campaign or party), the pick is the non-Republican candidate polling highest in it.
2. If there's no independent poll, the pick is the non-Republican candidate (or that candidate's party) that finished highest in the last comparable election.
3. If only one non-Republican is on the ballot, the race is **two-way**: the pick is that candidate, and turnout is what matters.
4. Where the method's answer is uncertain or the polls conflict, the label is `not-sure` and the reasoning says why.
5. **Exceptions are made by hand, written down, and flagged.** Example: when a Republican candidate matches the pick on abortion access, climate, or power bills and data centers, the race gets a `review_flags` entry for a human to review.

Picks start with `approved: false`. A human approves each one.

## Hard rules (Idaho law)
No ballot collection or delivery (Idaho Code 18-2324). No prizes, rewards or bets for pledging (18-2319, 18-2314). Never ask for ballot photos. Dates and procedures must match official sources exactly (18-2305).
