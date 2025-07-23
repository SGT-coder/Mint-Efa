-- Create the MintCRM database
CREATE DATABASE mintcrm;

-- Create a user for the application (optional)
CREATE USER mintcrm_user WITH PASSWORD 'your_password_here';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE mintcrm TO mintcrm_user;

-- Connect to the database
\c mintcrm;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
