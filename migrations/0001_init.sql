-- Pledge tally. No raw emails except in `reminders` (explicit opt-in) and `outbox` (waiting to send).
-- Everything is deleted after the election (see /privacy).
CREATE TABLE pledges (
  email_hmac TEXT PRIMARY KEY,      -- HMAC-SHA256(email) with a secret key; counts each person once
  county TEXT NOT NULL,
  ld INTEGER,                       -- legislative district, if known
  door TEXT NOT NULL DEFAULT 'isidahopurple.com',
  lang TEXT NOT NULL DEFAULT 'en',
  day TEXT NOT NULL                 -- YYYY-MM-DD only
);
CREATE INDEX pledges_county ON pledges (county);
CREATE INDEX pledges_ld ON pledges (ld);

-- Only for people who chose "remind me" in the verification email. Deleted Nov 4.
CREATE TABLE reminders (
  email TEXT PRIMARY KEY,
  lang TEXT NOT NULL DEFAULT 'en',
  day TEXT NOT NULL
);

-- Verification emails over the daily sending limit wait here, then are sent and deleted.
CREATE TABLE outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  link TEXT NOT NULL,
  remind_link TEXT NOT NULL,
  lang TEXT NOT NULL,
  created TEXT NOT NULL
);

-- Emails sent per UTC day, to stay under the provider's free limit.
CREATE TABLE send_log (
  day TEXT PRIMARY KEY,
  sent INTEGER NOT NULL DEFAULT 0
);
