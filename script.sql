-------------------------------------
-- maitre arsene
-- Projet : bj
-------------------------------------

-------------------------------------
-- CREATION
-------------------------------------

DROP SCHEMA IF EXISTS BlackJack CASCADE;
CREATE SCHEMA BlackJack;

SET
search_path TO BlackJack;

CREATE TABLE users
(
    user_id      SERIAL  NOT NULL,
    login        VARCHAR NOT NULL,
    mail         VARCHAR NOT NULL,
--     prenom         VARCHAR NOT NULL,
    password     VARCHAR NOT NULL,
    est_verifier BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (user_id),
    CONSTRAINT unique_email UNIQUE (mail),
    CONSTRAINT unique_login UNIQUE (login)
);

-------------------------------------
-- INSERTION DEFAULT
-------------------------------------
INSERT INTO users (login, mail, password)
VALUES
    ('admin', 'admin@example.com', 'adminpass'),
    ('user1', 'user1@example.com', 'password123');