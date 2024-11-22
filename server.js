const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = 3000;
const ACCESS_TOKEN_SECRET = 'secret_acces_token';
const REFRESH_TOKEN_SECRET = 'secret_refresh_token';

const ACCESS_TOKEN_EXPIRATION = '5h';
const REFRESH_TOKEN_EXPIRATION = '7d';

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'front', 'connexion')));
app.use(express.static(path.join(__dirname, 'front', 'accueil')));
app.use(express.static(path.join(__dirname, 'front', 'contact')));
app.use('/assets', express.static(path.join(__dirname, 'front', 'assets')));

// Middleware
const authenticate = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken) {
        if (!refreshToken) {
            return res.redirect('/');
        }
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            const newAccessToken = generateAccessToken({email: decoded.email});
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
            req.user = {email: decoded.email};
            next();
        } catch (err) {
            console.error('Refresh token invalide ou expiré', err);
            return res.status(403).json({message: 'Refresh token invalide ou expiré.'});
        }
    } else {
        try {
            const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            if (refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
                    const newAccessToken = generateAccessToken({email: decoded.email});

                    res.setHeader('Authorization', `Bearer ${newAccessToken}`);

                    req.user = {email: decoded.email};
                    next();
                } catch (err) {
                    console.error('Refresh token invalide ou expiré lors du fallback.', err);
                    return res.status(403).json({message: 'Refresh token invalide ou expiré.'});
                }
            } else {
                console.error('Accès non autorisé, token expiré ou invalide.');
                return res.status(401).json({message: 'Accès non autorisé, token expiré ou invalide.'});
            }
        }
    }

}
const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRATION});
};

// Générer un refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRATION});
};

// default
app.get('/', (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        try {
            console.log("refresh token detecté")
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
            return res.redirect('/accueil');
        } catch (err) {
            console.error('Refresh token invalide ou expiré');
        }
    }
    res.sendFile(path.join(__dirname, 'front', 'connexion', 'connexion.html'));
});

//PageAccueil
app.get('/accueil', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'accueil', 'accueil.html'));
});

app.get('/email', authenticate, (req, res) => {
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
        const user = {email};

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: 'Connexion réussie',
            accessToken,
            redirectTo: '/accueil',
        });
    } else {
        res.status(401).json({message: 'Email ou mot de passe incorrect'});
    }
});

// REFRESH TOKEN
app.post('/api/token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({message: 'Refresh token manquant'});
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const newAccessToken = generateAccessToken({email: decoded.email});

        res.json({
            accessToken: newAccessToken,
        });
    } catch (err) {
        console.error('Refresh token invalide ou expiré');
        res.status(403).json({message: 'Refresh token invalide ou expiré'});
    }
});

// LOGOUT
app.post('/api/logout', (req, res) => {
    console.log("deconnexion")
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    });
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: http://localhost:${PORT}/`);
});
