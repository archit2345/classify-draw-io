CREATE TABLE diagrams (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own diagrams
CREATE POLICY "Users can manage their own diagrams"
ON diagrams
FOR ALL
USING (auth.uid() = user_id);