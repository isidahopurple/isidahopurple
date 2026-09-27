# Idaho election law notes (2026)

> Compiled for isidahopurple.com as a starting checklist. **Not legal advice.** Laws change; check each statute and ask your Secretary of State. Forking for another state? Use this as a list of *questions to answer* for your state.
_Compiled 2026-09-22 by a Claude Code research agent from official sources. **Not legal advice.** Items marked UNVERIFIED need confirmation from the SoS office or Ada County._

> **Corrections found 2026-09-24.** Rechecked against official pages; `site/data/idaho/election.yaml` is now the source of truth.
> - **Ada Elections phone is (208) 287-6860** (elections@adacounty.id.gov). 287-7080 is the county's general line.
> - **Emergency absentee (Oct 29–Nov 2)** is only for voters hospitalized after 5 p.m. Oct 23 who hadn't already requested a ballot.
> - **Ballot collection (18-2324)** also allows a caregiver or someone the voter pays. Each helper is capped at 6 voted and 6 blank ballots. It's a felony at 10 or more, or if a third party paid the helper.
> - **Still open:** whether Ada polling places accept voted absentee ballots on Election Day. No official page says; call (208) 287-6860.

## Three findings that change the plan
1. **Idaho has no exemption for an individual's unpaid internet activity like the federal one.** Assume the $100-per-candidate state threshold applies to domain spending.
2. **Idaho's Sunshine reporting covers only state and local candidates.** Its definition of "public office" doesn't list federal offices. The Senate and House races fall under FEC rules, and there the site is likely exempt.
3. **Collecting other people's ballots is a crime (18-2324, 2024).** People connected to a group that supports or opposes candidates can't even use the family or household exceptions. **The site must never offer ballot pickup or delivery.**

## Key dates, Nov 3, 2026 general election
| Item | Date / rule | Source |
|---|---|---|
| Registration (mail, at the clerk, or online) | **Fri Oct 23, 5 p.m.** Online needs an Idaho DL or state ID. | voteidaho.gov/calendar ; /voter-registration ; Idaho Code 34-408 |
| Online registration conflict | Some third-party sites say Oct 9. **Contradicted by VoteIdaho; use Oct 23.** | |
| Same-day registration | Allowed at early voting and at the polls, with photo ID plus proof of residence | 34-408A |
| Absentee request | **Must be *received* by Fri Oct 23, 5 p.m.** A new request is needed each calendar year. Online needs DL/ID plus the last 4 of the SSN. | voteidaho.gov/casting-your-ballot |
| Emergency absentee | Oct 29 through Nov 2, 5 p.m. | voteidaho.gov/calendar |
| Early in-person voting | Statewide: counties may run Oct 13–30. **Ada: Oct 19–30, weekdays 8–5, 10 sites.** | adacounty.id.gov/elections/early-voting |
| Absentee return | **Must be *received* by 8 p.m. Nov 3. A postmark doesn't count.** | 34-1005 |
| Where to return | Mail, the Ada Elections Office (400 N Benjamin Ln), or 6 drop boxes: the Elections Office plus Boise, Meridian, Eagle, Star and Kuna city halls. **Polling places probably not (UNVERIFIED).** | adacounty.id.gov/elections/absentee-voting |
| Polls | 8 a.m.–8 p.m. | Ada County |
| Sample ballots | VoteIdaho lookup and Ada's "View my ballot." Release date UNVERIFIED. | |

## Voter ID
- **Accepted at the polls (34-1113):**
  - Idaho driver's license or ID card
  - US passport or federal photo ID
  - Tribal photo ID
  - Idaho concealed-carry license
- **Student IDs no longer count** (HB 124, 2023).
- **No-ID affidavit** (34-1114, amended by SB 1322, 2026): it now needs name, address, **and date of birth or Idaho DL/ID number**. False statements on it are a felony.
- **New registrants** need a photo ID plus proof of residence, must be 18 or older and a US citizen, and must have lived in Idaho 30 days.

## Idaho Sunshine Law (Title 67, Ch. 66)
- **Threshold, 67-6611(1):** file once independent expenditures exceed **$100 in total for any one candidate**. The section was last amended in 2021.
- **Deadlines:** at least 7 days before the election (**Oct 27, 2026**) and 30 days after (**Dec 3, 2026**). A 48-hour report applies only at $1,000 or more.
- **Where to file:** the Sunshine portal's no-account path, https://sunshine.voteidaho.gov/nonregister/independentexpenditurereport , or paper form C-4.
- **Definitions (67-6602):**
  - The site's recommendations = **express advocacy**.
  - The operator is **not a political committee**, because no contributions are received.
  - "Public office" doesn't include federal offices.
- **Attribution, 67-6614A:** the "person responsible" must be clearly shown on "general public political advertising."
  - The law sets no exact wording.
  - Whether a website counts is UNVERIFIED.
  - **Add the attribution line anyway.**
- **Deepfakes, 67-6628A:** manipulated candidate audio or video must be labeled. Better: don't use any.
- **Penalties:** civil fine up to $250. Knowing and willful violations are a misdemeanor.

## Federal (FEC), U.S. Senate and House races
- **Unpaid internet activity is exempt (11 CFR 100.155 / 100.94).** That covers website hosting and **domain names**.
- **No federal disclaimer is needed** for a self-hosted individual site with no paid promotion (110.11).
- **Form 5 is likely not triggered**, because exempt internet costs don't count toward its $250 threshold.
- **Paid ads or boosted posts end the exemption** and require a full disclaimer.

## Pledges and election crimes
- **Porter v. Bowen (9th Cir. 2007):** vote-swapping websites are protected by the First Amendment. This is binding in Idaho.
- **18-2319:** "No person shall attempt to influence the vote... by means of a promise or a favor." → **No prizes, rewards or perks for pledging.**
- **18-2314:** betting on the vote is a misdemeanor. → **No stakes and no prediction wagering.**
- **18-2305:** misleading a voter could create exposure. → **Dates and procedures on the site must be exactly right.**
- **18-2318:** no electioneering within 250 ft of polling place entrances.
- **18-2324:** no collecting ballots. The site must never offer it.
- **Ballot photos:** sharing marked ballots appears to be discouraged. **Never ask for a ballot photo as proof.**

## Privacy, TCPA and CAN-SPAM
- **Idaho privacy:** no comprehensive privacy law. The breach-notification law (28-51-104 to 107) centers on SSN, DL and financial data.
- **TCPA:** a one-time code sent because the user asked for it is generally treated as having consent. Honor STOP.
- **CAN-SPAM:** covers commercial email only.
- **Practical rules:**
  - Collect the minimum and store it hashed.
  - Publish a privacy policy and delete the data after the election.
  - **Never share the list with a campaign.** That risks coordination and list-transfer problems.

## Contacts
- **Idaho SoS Elections Division:** **(208) 334-2852**, **elections@sos.idaho.gov**, 700 W Jefferson #E205, Boise. M–F 8–5.
- **Ada County Elections:** 400 N Benjamin Ln Ste 100, Boise. **208-287-7080**.

## Must-do compliance checklist
1. Put an attribution line on every page: "Paid for by [Full Name], Boise, Idaho. Not authorized by any candidate or candidate's committee. No donations accepted."
2. Keep a spending log with date, payee, purpose and allocation by race.
3. If spending attributed to any one state or local candidate exceeds $100, file through Sunshine by **Oct 27**, then by **Dec 3**. If in doubt, file.
4. Buy no paid ads or boosted posts, unless we deliberately accept the disclaimer and reporting work.
5. Take no donations or in-kind help from campaigns. No coordination, and no sharing of data with any campaign.
6. Offer no incentives, prizes or bets for pledging, and ask for no ballot photos.
7. Never offer ballot collection or delivery.
8. Use only official dates and link to VoteIdaho and Ada County.
9. Use no manipulated media.
10. Publish a privacy policy, collect minimal data, and delete it after the election.

## Questions to ask the SoS office (one call before launch)
1. Does a self-hosted, unpaid website count as "general public political advertising" under 67-6614A? Is there preferred attribution wording?
2. How should about $150 of shared costs be allocated across many candidates for the $100-per-candidate test? Do they want a report even if every candidate's share is under $100?
3. Does 67-6611 cover federal candidates at all?
4. Can an absentee ballot be turned in at an Ada polling place on Election Day?
5. Could a public "pledge" tally be read as a "promise or favor" under 18-2319?
6. When are Ada sample ballots published?
