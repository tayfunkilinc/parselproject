/*
  # Create Parcels Table

  1. New Tables
    - `parcels`
      - `id` (uuid, primary key) - Unique identifier
      - `ada_no` (text) - Ada (block) number
      - `parsel_no` (text) - Parcel number
      - `il` (text) - Province name
      - `ilce` (text) - District name
      - `mahalle` (text) - Neighborhood name
      - `coordinates` (jsonb) - Parcel boundary coordinates
      - `created_at` (timestamp) - Creation timestamp
      - `user_id` (uuid, nullable) - User who created the entry
  
  2. Security
    - Enable RLS on `parcels` table
    - Add policy for anyone to read all parcels (public data)
    - Add policy for authenticated users to insert their own parcels
    - Add policy for authenticated users to delete their own parcels
*/

CREATE TABLE IF NOT EXISTS parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ada_no text NOT NULL,
  parsel_no text NOT NULL,
  il text DEFAULT '',
  ilce text DEFAULT '',
  mahalle text DEFAULT '',
  coordinates jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parcels"
  ON parcels FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert parcels"
  ON parcels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own parcels"
  ON parcels FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS parcels_ada_parsel_idx ON parcels(ada_no, parsel_no);