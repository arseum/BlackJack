-------------------------------------
-- maitre arsene
-- Projet : bj
-------------------------------------

-------------------------------------
-- CREATION
-------------------------------------

DROP SCHEMA IF EXISTS BlackJack CASCADE;
CREATE SCHEMA BlackJack;

SET search_path TO BlackJack;

CREATE TABLE users
(
    user_id  SERIAL  NOT NULL,
    login    VARCHAR NOT NULL,
    mail     VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    est_verifier BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT pk_user PRIMARY KEY (user_id)
);

-------------------------------------
-- INSERTION DEFAULT
-------------------------------------