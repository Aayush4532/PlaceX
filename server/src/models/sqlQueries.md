----------------------------------------------------------------------------------------------------------------------------------
<----------------------------------------------------------UserModel------------------------------------------------------------->
----------------------------------------------------------------------------------------------------------------------------------

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_student_email_key ON users (lower(student_email));
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON users;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

COMMIT;

----------------------------------------------------------------------------------------------------------------------------------
<--------------------------------------------------------CompaniesModel---------------------------------------------------------->
----------------------------------------------------------------------------------------------------------------------------------

BEGIN;

CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link VARCHAR(500) NOT NULL,
  logo_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS companies_name_key ON companies (lower(name));
CREATE INDEX IF NOT EXISTS companies_link_idx ON companies (link);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON companies;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

COMMIT;

----------------------------------------------------------------------------------------------------------------------------------
<-----------------------------------------------------------Job Models----------------------------------------------------------->
----------------------------------------------------------------------------------------------------------------------------------

BEGIN;

CREATE TABLE IF NOT EXISTS JobPostings (
  id BIGSERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  salary_amount VARCHAR(50) NOT NULL,
  salary_unit VARCHAR(50) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  company_type VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  eligibility TEXT[] NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  application_link VARCHAR(1000) NOT NULL,
  rounds TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS JobPostings_company_name_idx ON JobPostings (lower(company_name));
CREATE INDEX IF NOT EXISTS JobPostings_job_type_idx ON JobPostings (job_type);
CREATE INDEX IF NOT EXISTS JobPostings_deadline_idx ON JobPostings (deadline);
CREATE INDEX IF NOT EXISTS JobPostings_application_link_idx ON JobPostings (application_link);
CREATE INDEX IF NOT EXISTS JobPostings_eligibility_gin ON JobPostings USING gin (eligibility);
CREATE INDEX IF NOT EXISTS JobPostings_rounds_gin ON JobPostings USING gin (rounds);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON JobPostings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON JobPostings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

COMMIT;

----------------------------------------------------------------------------------------------------------------------------------