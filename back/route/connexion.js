const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const security = require('../middlewares/security');
const {query} = require("../bdd");

// INSCRIPTION
router.post('/signup', async (req, res) => {
    const {login, email, password} = req.body;

    if (!login || !email || !password) {
        return res.status(400).json({message: "Tous les champs sont obligatoires"});
    }

    const result = await query('SELECT * FROM users WHERE mail = $1', [email]);

    if (result.rows.length > 0) {
        return res.status(400).json({message: 'L\'email est déjà utilisé'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await query(
        'INSERT INTO users (login, mail, password) VALUES ($1, $2, $3) RETURNING *',
        [login, email, hashedPassword]
    );

    const newUser = insertResult.rows[0];
    console.log("DEBUG: nouvelle inscription !");
    return res.status(201).json({message: 'Inscription réussie', user: newUser});
});

// CONNEXION
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Email et mot de passe sont requis"});
    }

    const result = await query('SELECT * FROM users WHERE mail = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(401).json({message: 'Email ou mot de passe incorrect'});
    }

    const user = result.rows[0];

    console.log("DEBUG: connexion avec l'user", user);
    console.log("DEBUG: mdp recu:", password);
    console.log("DEBUG: mdp requis:", user.password);

    bcrypt.compare(password, user.password, function (error, response) {
        if (error) {

        }
        if (response) {
            const token = security.generateAccessToken(user);
            console.log(`DEBUG: connexion réussi avec ${user.login} !`);

            security.assignJWT(user, res);
            res.status(200).json();
        } else {
            console.log(`DEBUG: mot de passe invalid pour ${user.login} !`);
            return res.status(401).json({message: 'Email ou mot de passe incorrect'});
        }
    });
});

// LOGOUT
router.post('/logout', (req, res) => {
    security.flushJWT(res)
    res.status(200).json({
        message: 'déconnexion réussie',
    });
});

module.exports = router;