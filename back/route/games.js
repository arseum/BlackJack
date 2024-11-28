const express = require('express');
const router = express.Router();

const security = require('../middlewares/security');
const {query} = require("../bdd");

router.get('/', security.checkJWT, async (req, res) => {
    console.log("GET games de l'user ...");
    const result = await query('SELECT * FROM games WHERE status = $1', ['active']);
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

router.get('/:id/join', security.checkJWT, async (req, res) => {
    const {tableId} = req.params;


    try {
        const userId = req.user.user_id; // todo retrouver user

        const game = await query('SELECT * FROM games WHERE game_id = $1', [tableId]);
        if (game.rows.length === 0) {
            return res.status(404).json({error: 'Table non trouvée'});
        }

        // Ajouter le joueur
        await query(
            'INSERT INTO game_players (game_id, user_id) VALUES ($1, $2)',
            [tableId, userId]
        );

        res.json({message: `Utilisateur ajouté à la table ${tableId}`});
    } catch (error) {
        console.error('Erreur lors de l\'ajout du joueur :', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
});

module.exports = router;