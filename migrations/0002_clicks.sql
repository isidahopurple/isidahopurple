-- Outbound button taps on the home page, per day and button. No personal data (PLAN §9 metric).
CREATE TABLE clicks (
  day TEXT NOT NULL,
  button TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, button)
);
