const express = require('express');
const router = express.Router();
const path = require('path');

const security = require('../middlewares/security');
const connexionRoute = require('./connexion');
const gameRouter = require('./games');

router.use('/connexion', express.static(path.join(__dirname, '../../front/connexion')));
router.use('/accueil', express.static(path.join(__dirname, '../../front/accueil')));
router.use('/contact', express.static(path.join(__dirname, '../../front/contact')));
router.use('/game', express.static(path.join(__dirname, '../../front/games')));
router.use('/assets', express.static(path.join(__dirname, '../../front/assets')));

// default
router.get('/', security.checkJWT, (req, res, next) => {
    return res.redirect('/accueil');
});

//PageAccueil
router.get('/accueil', security.checkJWT, (req, res, next) => {
    console.log(req.decoded);
    res.sendFile(path.join(__dirname, '../../front/accueil/accueil.html'));
});

//Page connexion
router.get('/connexion', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front/connexion/connexion.html'));
});

//Page games
router.get('/game', security.checkJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../../front/games/games.html'));
});

//Page contact
router.get('/email', security.checkJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../../front/contact/contact.html'));
});

router.use('/api', connexionRoute);
router.use('/api/games', gameRouter);

module.exports = router;