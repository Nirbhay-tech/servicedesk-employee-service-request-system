CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee','support','admin')),
  department VARCHAR(30) NOT NULL DEFAULT 'General' CHECK (department IN ('IT','HR','Facilities','Finance','General')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  request_number VARCHAR(24) NOT NULL UNIQUE,
  requester_id BIGINT NOT NULL REFERENCES users(id),
  assignee_id BIGINT REFERENCES users(id),
  category VARCHAR(20) NOT NULL CHECK (category IN ('IT','HR','Facilities')),
  title VARCHAR(140) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(12) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status VARCHAR(24) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting_for_employee','resolved','closed')),
  sla_due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS request_activity (
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  actor_id BIGINT REFERENCES users(id),
  action VARCHAR(40) NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_status_sla ON requests(status, sla_due_at);
CREATE INDEX IF NOT EXISTS idx_requests_assignee ON requests(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_request ON request_activity(request_id, created_at DESC);
