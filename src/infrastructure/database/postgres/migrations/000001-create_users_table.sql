CREATE TYPE application.UserRole AS ENUM ('ADMIN', 'CREATOR', 'VIEWER');
CREATE TYPE application.UserStatus AS ENUM ('ACTIVE', 'BLOCKED');

CREATE TABLE application.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(127) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role application.UserRole NOT NULL DEFAULT 'VIEWER',
    status application.UserStatus NOT NULL DEFAULT 'ACTIVE',
    fullname VARCHAR(127) NOT NULL
);

CREATE INDEX inx_users_username ON application.users(username);
CREATE INDEX inx_users_email ON application.users(email);
