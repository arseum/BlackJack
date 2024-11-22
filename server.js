const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'front', 'connexion')));
app.use(express.static(path.join(__dirname, 'front', 'accueil')));
app.use(express.static(path.join(__dirname, 'front', 'contact')));
app.use('/assets', express.static(path.join(__dirname, 'front', 'assets')));

// PageConnexion
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'connexion', 'connexion.html'));
});
//PageAccueil
app.get('/accueil', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'accueil', 'accueil.html'));
});

app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'contact', 'contact.html'));
});

// CONNEXION
app.post('/api/login', (req, res) => {
    const { email, mdp } = req.body;
    console.log('Email:', email);
    console.log('Mot de passe:', mdp);

    if (email === "test@test" && mdp === "test") {
        res.json({ 
            message: 'Connexion réussie',
            redirectTo: '/accueil',
        });
    } else {
        res.json({ message: 'Email ou mot de passe incorrect' });
    }
});

// INSCRIPTION
app.post('/api/signup', (req, res) => {
    const { prenom, email, mdp } = req.body;
    console.log('Prénom:', prenom);
    console.log('Email:', email);
    console.log('Mot de passe:', mdp);
    if (prenom === "test" && email === "test@test" && mdp === "test") {
        res.json({ message: 'Inscription réussie' });
    }
    else {
        res.json({ message: 'Erreur lors de l\'inscription' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});