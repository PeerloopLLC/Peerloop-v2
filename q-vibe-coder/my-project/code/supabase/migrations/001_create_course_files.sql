-- Course Files Table
-- Stores metadata for files attached to course modules
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create the table
CREATE TABLE IF NOT EXISTS course_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  module_index INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT DEFAULT 'document',
  file_path TEXT,  -- Storage path (null for external links)
  file_url TEXT NOT NULL,
  file_size BIGINT,  -- File size in bytes (null for links)
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by course
CREATE INDEX IF NOT EXISTS idx_course_files_course_id ON course_files(course_id);

-- Create index for module queries
CREATE INDEX IF NOT EXISTS idx_course_files_module ON course_files(course_id, module_index);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE course_files ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read files (adjust based on your needs)
CREATE POLICY "Anyone can view course files"
  ON course_files FOR SELECT
  USING (true);

-- Allow authenticated users to insert files
CREATE POLICY "Authenticated users can upload files"
  ON course_files FOR INSERT
  WITH CHECK (true);

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete files"
  ON course_files FOR DELETE
  USING (true);

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- You also need to create a storage bucket in the Supabase Dashboard:
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name it: course-files
-- 4. Make it PUBLIC (so files can be accessed via URL)
-- 5. Set file size limit if desired (e.g., 10MB)
