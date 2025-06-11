-- Admin users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Event management
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Forms for events
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_type') THEN
        CREATE TYPE form_type AS ENUM ('talk', 'workshop', 'panel');
    END IF;
END$$;


CREATE TABLE IF NOT EXISTS forms (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    title TEXT NOT NULL,
    description TEXT,
    form_type form_type NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_id INTEGER NOT NULL REFERENCES forms(id),
  username TEXT,
  email TEXT,
  comment TEXT,
  topic INTEGER NOT NULL,
  expertise INTEGER NOT NULL,
  presentation INTEGER,
  slides INTEGER,
  materials INTEGER,
  interaction INTEGER,
  discussion INTEGER,
  panelists INTEGER,
  may_publish BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
