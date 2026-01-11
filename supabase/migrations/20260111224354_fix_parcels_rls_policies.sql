/*
  # Fix Parcels RLS Policies for Public Access

  1. Changes
    - Drop existing INSERT policy that requires authentication
    - Drop existing DELETE policy that requires authentication
    - Create new INSERT policy for anonymous (public) users
    - Create new DELETE policy for anonymous users
  
  2. Security
    - Allow anyone to insert parcels (public app, no auth required)
    - Allow anyone to delete parcels (public app)
    - Keep SELECT policy as is (anyone can view)
*/

DROP POLICY IF EXISTS "Authenticated users can insert parcels" ON parcels;
DROP POLICY IF EXISTS "Users can delete own parcels" ON parcels;

CREATE POLICY "Anyone can insert parcels"
  ON parcels FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete parcels"
  ON parcels FOR DELETE
  USING (true);

CREATE POLICY "Anyone can update parcels"
  ON parcels FOR UPDATE
  USING (true)
  WITH CHECK (true);
