const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'L/4UuYuTj28m'; // todo variable env
const ACCESS_TOKEN_EXPIRATION = 5 * 60 * 60; //5h

const generateAccessToken = (user) => {
    return jwt.sign({user: user}, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRATION});
};

const checkJWT = async (req, res, next) => {

    let token = req.cookies.token;

    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.redirect('/connexion');
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: 'Token invalide ou expiré'});
        }

        req.user = decoded.user;
        next();
    });
};

const assignJWT = (user, res) => {
    const newToken = generateAccessToken(user);
    // res.header('Authorization', 'Bearer ' + newToken); // ne marche pas
    // je met le token dans les cookies, surement a revoir
    res.cookie('token', 'Bearer ' + newToken, {
        httpOnly: true,
        secure: false, // prod = true
        maxAge: ACCESS_TOKEN_EXPIRATION,
    });
};

const flushJWT = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    });
};

module.exports = {
    checkJWT,
    assignJWT,
    flushJWT,
    generateAccessToken
};