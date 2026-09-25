-- Verification emails sent per person per day (keyed by the email HMAC), to stop inbox flooding.
CREATE TABLE email_sends (
  h TEXT NOT NULL,
  day TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (h, day)
);
