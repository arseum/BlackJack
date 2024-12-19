const express = require('express');
const router = express.Router();

const security = require('../middlewares/security');
const {query} = require("../bdd");

router.get('/', security.checkJWT, async (req, res) => {
    console.log("GET games joignable de l'user ...");
    const user = req.user
    const result = await query(`
        SELECT DISTINCT *
        FROM games as G
        WHERE G.status = 'active'
        EXCEPT
        SELECT DISTINCT G.*
        FROM games as G
                 NATURAL JOIN game_players as GP
        WHERE G.status = 'active'
          and GP.user_id = ${user.user_id}`
    );
    console.log(result.rows);
    res.json({games: result.rows});
});

router.get('/active', security.checkJWT, async (req, res) => {
    console.log("GET games active de l'user ...");
    const user = req.user
    const result = await query(`
        SELECT DISTINCT *
        FROM games as G
                 NATURAL JOIN game_players as GP
        WHERE G.status = 'active'
          and GP.user_id = ${user.user_id}`
    );
    console.log(result.rows);
    res.json({games: result.rows});
});

router.post('/create', security.checkJWT, async (req, res) => {
    const {tableName, maxPlayers} = req.body;

    try {
        const result = await query('INSERT INTO games (table_name, max_players) VALUES ($1, $2)', [tableName, maxPlayers]);
        res.status(201).json({message: 'Table créée avec succès', table: result.rows[0]});
    } catch (error) {
        console.error('Erreur lors de la création de la table :', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

router.get('/:tableId/join', security.checkJWT, async (req, res) => {
    const {tableId} = req.params;

    try {
        const userId = req.user.user_id;

        const game = await query(`
            SELECT *
            FROM games
            WHERE game_id = ${tableId}
        `);

        if (game.rows.length === 0) {
            return res.status(404).json({error: 'Table non trouvée'});
        }

        await query(`
            INSERT INTO game_players (game_id, user_id)
            VALUES (${tableId}, ${userId})
        `);

        res.json({message: `Utilisateur ajouté à la table ${tableId}`});
    } catch (error) {
        console.error('Erreur lors de l\'ajout du joueur :', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

router.get('/:tableId/counters', security.checkJWT, async (req, res) => {
    const {tableId} = req.params;

    try {
        const result = await query(
            `SELECT user_id, score
             FROM game_players
             WHERE game_id = ${tableId}`
        );
        res.json({players: result.rows});
    } catch (error) {
        console.error('Erreur lors de la récupération des compteurs :', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

router.post('/:tableId/score/:userId', security.checkJWT, async (req, res) => {
    const {tableId, userId} = req.params;
    const {score} = req.body;

    try {
        await query(
            `UPDATE game_players
             SET score = ${score}
             WHERE game_id = ${tableId}
               AND user_id = ${userId}`
        );
        res.json({message: 'Compteur mis à jour avec succès'});
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur :', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

module.exports = router;