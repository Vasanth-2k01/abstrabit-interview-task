-- Create table
CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  url text NOT NULL,
  title text,
  description text,
  image_url text,
  favicon_url text,
  tags text[],
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- INSERT policy
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT policy
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
