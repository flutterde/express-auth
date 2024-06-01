# EXPRESS APP
this is a simple Express js app for authentication and reading posts from Postgres database

## Usage

1. clone the repo

2. create database in Neon

### Setup database schema

```SQL
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- Index on email for faster lookups (Not requied!)
CREATE UNIQUE INDEX idx_users_email ON users (email);
```

3. copy the .env.example to .env and app missing data to it

4. run `npm i` && `npm run dev`. 