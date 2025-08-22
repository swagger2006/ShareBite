/*
  # Food Sharing Platform Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) 
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - 'FoodProvider', 'NGO/Volunteer', 'Individual', 'Admin'
      - `organization` (text, optional)
      - `phone` (text, optional)
      - `address` (text, optional)
      - `created_at` (timestamp)
      
    - `food_listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `quantity` (integer)
      - `location` (text)
      - `expiry_time` (timestamp)
      - `status` (text) - 'Available', 'Requested', 'Collected', 'Distributed'
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
      
    - `requests`
      - `id` (uuid, primary key)
      - `food_item` (uuid, foreign key to food_listings)
      - `requested_by` (uuid, foreign key to users)
      - `status` (text) - 'Pending', 'Approved', 'Completed'
      - `message` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Users can only see appropriate data based on their role
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('FoodProvider', 'NGO/Volunteer', 'Individual', 'Admin')),
  organization text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Food listings table
CREATE TABLE IF NOT EXISTS food_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  location text NOT NULL,
  expiry_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Requested', 'Collected', 'Distributed')),
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item uuid REFERENCES food_listings(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Completed')),
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert user data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin can read all user data
CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- RLS Policies for food_listings table
CREATE POLICY "Anyone can read food listings"
  ON food_listings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Food providers can insert their own listings"
  ON food_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'FoodProvider'
    )
  );

CREATE POLICY "Food providers can update their own listings"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'FoodProvider'
    )
  );

CREATE POLICY "Food providers can delete their own listings"
  ON food_listings
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'FoodProvider'
    )
  );

-- Admin can update any food listing
CREATE POLICY "Admin can update any food listing"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- RLS Policies for requests table
CREATE POLICY "Users can read relevant requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = requested_by OR
    auth.uid() IN (
      SELECT created_by FROM food_listings WHERE id = food_item
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

CREATE POLICY "NGOs/Volunteers/Individuals can insert requests"
  ON requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = requested_by AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('NGO/Volunteer', 'Individual', 'Admin')
    )
  );

CREATE POLICY "Food providers and admins can update requests"
  ON requests
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT created_by FROM food_listings WHERE id = food_item
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_listings_status ON food_listings(status);
CREATE INDEX IF NOT EXISTS idx_food_listings_created_by ON food_listings(created_by);
CREATE INDEX IF NOT EXISTS idx_food_listings_expiry_time ON food_listings(expiry_time);
CREATE INDEX IF NOT EXISTS idx_requests_food_item ON requests(food_item);
CREATE INDEX IF NOT EXISTS idx_requests_requested_by ON requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);