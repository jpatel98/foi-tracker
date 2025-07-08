-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE region_type AS ENUM (
  'ontario', 'federal', 'alberta', 'british_columbia', 'manitoba', 
  'new_brunswick', 'newfoundland', 'nova_scotia', 'pei', 'quebec', 
  'saskatchewan', 'northwest_territories', 'nunavut', 'yukon'
);

CREATE TYPE foi_status AS ENUM (
  'submitted', 'received', 'appealed', 'fulfilled', 'denied'
);

CREATE TYPE reminder_type AS ENUM (
  'follow-up', 'appeal', 'deadline'
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FOI Requests table
CREATE TABLE foi_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  agency TEXT NOT NULL,
  region region_type NOT NULL,
  status foi_status DEFAULT 'submitted',
  submitted_date DATE NOT NULL,
  deadline_date DATE NOT NULL,
  response_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  foi_id UUID REFERENCES foi_requests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  foi_id UUID REFERENCES foi_requests(id) ON DELETE CASCADE,
  reminder_type reminder_type NOT NULL,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  foi_id UUID REFERENCES foi_requests(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_foi_requests_user_id ON foi_requests(user_id);
CREATE INDEX idx_foi_requests_status ON foi_requests(status);
CREATE INDEX idx_foi_requests_deadline ON foi_requests(deadline_date);
CREATE INDEX idx_notes_foi_id ON notes(foi_id);
CREATE INDEX idx_reminders_foi_id ON reminders(foi_id);
CREATE INDEX idx_reminders_unsent ON reminders(sent) WHERE sent = false;
CREATE INDEX idx_files_foi_id ON files(foi_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE foi_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- FOI requests policies
CREATE POLICY "Users can view own FOI requests" ON foi_requests
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own FOI requests" ON foi_requests
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own FOI requests" ON foi_requests
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own FOI requests" ON foi_requests
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Notes policies
CREATE POLICY "Users can view notes for own FOI requests" ON notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = notes.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert notes for own FOI requests" ON notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = notes.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  );

-- Reminders policies
CREATE POLICY "Users can view reminders for own FOI requests" ON reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = reminders.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert reminders for own FOI requests" ON reminders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = reminders.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  );

-- Files policies
CREATE POLICY "Users can view files for own FOI requests" ON files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = files.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert files for own FOI requests" ON files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM foi_requests 
      WHERE foi_requests.id = files.foi_id 
      AND foi_requests.user_id::text = auth.uid()::text
    )
  ); 