const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const security = require('./back/middlewares/security');
const jwt = require("jsonwebtoken");

const PORT = 3000;

const ACCESS_TOKEN_SECRET = 'L/4UuYuTj28m';

const ACCESS_TOKEN_EXPIRATION = 5 * 60 * 60; //5h

app.use(bodyParser.json());
app.use(cors({
        exposedHeaders: ['Authorization'],
        origin: '*'
    }
));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'front', 'connexion')));
app.use(express.static(path.join(__dirname, 'front', 'accueil')));
app.use(express.static(path.join(__dirname, 'front', 'contact')));
app.use('/assets', express.static(path.join(__dirname, 'front', 'assets')));

// default
app.get('/', security.checkJWT, (req, res, next) => {
    return res.redirect('/accueil');
});

//PageAccueil
app.get('/accueil', security.checkJWT, (req, res, next) => {
    res.sendFile(path.join(__dirname, 'front', 'accueil', 'accueil.html'));
});

//Page connexion
app.get('/connexion', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'connexion', 'connexion.html'));
});

app.get('/email', security.checkJWT, (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'contact', 'contact.html'));
});

// INSCRIPTION
app.post('/api/signup', (req, res) => {
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
app.post('/api/login', (req, res) => {
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
app.post('/api/logout', (req, res) => {
    security.flushJWT(res)
    res.status(200).json({
        message: 'deconnexion réussie',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: http://localhost:${PORT}/`);
});
