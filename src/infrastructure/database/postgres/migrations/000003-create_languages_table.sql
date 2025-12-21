CREATE TABLE application.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(127) NOT NULL,
    code VARCHAR(7) UNIQUE NOT NULL
);
