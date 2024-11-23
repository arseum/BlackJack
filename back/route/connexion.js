const express = require('express');
const router = express.Router();

const security = require('../middlewares/security');

// INSCRIPTION
router.post('/signup', (req, res) => {
    const {prenom, email, mdp} = req.body;
    console.log('Prénom:', prenom);
    console.log('Email:', email);
    console.log('Mot de passe:', mdp);
    if (prenom === "test" && email === "test@test" && mdp === "test") {
        res.json({message: 'Inscription réussie'});
    } else {
        res.json({message: 'Erreur lors de l\'inscription'});
    }
});

// CONNEXION
router.post('/login', (req, res) => {
    const {email, mdp} = req.body;
    console.log('Email:', email);
    console.log('Mot de passe:', mdp);

    if (email === "test@test" && mdp === "test") {
        const user = {email}; // todo definir un objet user ou laisser l'object user juste avec le mail

        security.assignJWT(user, res)

        res.status(200).json({
            message: 'Connexion réussie',
        });
    } else {
        res.status(401).json({message: 'Email ou mot de passe incorrect'});
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    security.flushJWT(res)
    res.status(200).json({
        message: 'deconnexion réussie',
    });
});

module.exports = router;