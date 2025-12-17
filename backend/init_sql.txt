
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Control Plane Schema
CREATE SCHEMA IF NOT EXISTS system;

-- Projects Metadata
CREATE TABLE system.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    db_config JSONB NOT NULL DEFAULT '{}',
    jwt_secret TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users for the System itself
CREATE TABLE system.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auth Schema for Projects (Default template)
CREATE SCHEMA IF NOT EXISTS auth;

-- Seed Default Project
INSERT INTO system.projects (name, slug, jwt_secret) 
VALUES ('Default Project', 'default', encode(gen_random_bytes(32), 'hex'));
