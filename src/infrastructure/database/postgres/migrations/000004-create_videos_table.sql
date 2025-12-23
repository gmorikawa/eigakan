CREATE TABLE application.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(127) NOT NULL,
    description VARCHAR (1023),
    released_at TIMESTAMP,
    language_id UUID REFERENCES application.languages(id),
    file_id UUID REFERENCES application.files(id),
    tags VARCHAR(255)
);
