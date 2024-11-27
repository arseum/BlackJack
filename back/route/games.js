const express = require('express');
const router = express.Router();

const security = require('../middlewares/security');
const {query} = require("../bdd");

router.get('/', security.checkJWT, async (req, res) => {
    const result = await query('SELECT * FROM games WHERE status = $1', ['active']);
    res.json({games: result.rows});
});

router.post('/create', security.checkJWT , (req, res) => {
    const { tableName, maxPlayers } = req.body;

    res.status(201).json({ message: 'Table créée avec succès', tableName });
});

router.get('/:id/join', security.checkJWT, (req, res) => {
    const { tableId } = req.params;
    const user = req.decoded.user;

    res.json({ message: `Utilisateur ajouté à la table ${tableId}` });
});

module.exports = router;