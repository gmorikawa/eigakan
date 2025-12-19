CREATE TYPE application.FileState AS ENUM ('UPLOADING', 'AVAILABLE', 'CORRUPTED');

CREATE TABLE application.file_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(127) NOT NULL,
    extension VARCHAR(15) UNIQUE NOT NULL,
    mime_type VARCHAR(127) NOT NULL
);

CREATE TABLE application.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path VARCHAR(1023) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    type_id UUID REFERENCES application.file_types(id) NOT NULL,
    state application.FileState NOT NULL DEFAULT 'UPLOADING',

    UNIQUE (path, filename)
);
