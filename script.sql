-------------------------------------
-- maitre arsene
-- Projet : bj
-------------------------------------

-------------------------------------
-- CREATION
-------------------------------------

-- DROP SCHEMA IF EXISTS BlackJack CASCADE;
-- CREATE SCHEMA BlackJack;
--
-- SET search_path TO BlackJack;

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

CREATE TABLE games
(
    game_id     SERIAL NOT NULL,
    table_name  VARCHAR(255) NOT NULL,
    max_players INT         DEFAULT 4,
    status      VARCHAR(50) DEFAULT 'active',
    created_at  TIMESTAMP   DEFAULT NOW(),
    CONSTRAINT pk_games PRIMARY KEY (game_id)
);

CREATE TABLE game_players
(
    game_player_id SERIAL PRIMARY KEY,
    game_id        INT REFERENCES games(game_id),
    user_id        INT REFERENCES users(user_id),
    score          INT       DEFAULT 0,
    joined_at      TIMESTAMP DEFAULT NOW()
);

-------------------------------------
-- INSERTION DEFAULT
-------------------------------------
INSERT INTO users (login, mail, password)
VALUES ('toto', 'toto@toto.com', 'toto');