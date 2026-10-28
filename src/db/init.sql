CREATE TYPE changelog_type AS ENUM ('normal','conflict');
CREATE TYPE resolution_type AS ENUM ('server_wins','client_wins');


CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS changelogs(
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    document_id int NOT NULL,
    type changelog_type Default 'normal', -- normal or conflicted
    client_version INT DEFAULT NULL,
    server_version INT DEFAULT NULL,
    resolution resolution_type DEFAULT NULL, -- client_wins, server_wins, null for normal
    description VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document FOREIGN KEY (document_id) REFERENCES documents(id)
);