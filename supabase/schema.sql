-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit purchase history
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  stripe_payment_id TEXT,
  credits_added INTEGER,
  amount_paid INTEGER,  -- in cents
  pack_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulk verification jobs
CREATE TABLE bulk_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  file_name TEXT,
  total_emails INTEGER,
  processed INTEGER DEFAULT 0,
  valid_count INTEGER DEFAULT 0,
  invalid_count INTEGER DEFAULT 0,
  risky_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',  -- pending | processing | complete | failed
  report_path TEXT,  -- Supabase Storage path
  credits_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Individual verification results (for bulk jobs)
CREATE TABLE verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES bulk_jobs(id) ON DELETE CASCADE,
  email TEXT,
  status TEXT,
  reason TEXT,
  risk_level TEXT,
  domain TEXT,
  disposable BOOLEAN,
  mx_found BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own purchases" ON credit_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own jobs" ON bulk_jobs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own jobs" ON bulk_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view results for their own jobs" ON verification_results
  FOR SELECT USING (
    job_id IN (SELECT id FROM bulk_jobs WHERE user_id = auth.uid())
  );
