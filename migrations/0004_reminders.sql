-- Which reminder each opted-in address has already received, so nobody gets one twice.
CREATE TABLE reminder_sent (
  email TEXT NOT NULL,
  reminder TEXT NOT NULL,
  PRIMARY KEY (email, reminder)
);
