const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'L/4UuYuTj28m';

const ACCESS_TOKEN_EXPIRATION = 5 * 60 * 60; //5h

const generateAccessToken = (user) => {
    return jwt.sign({user: user}, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRATION});
};

const checkJWT = async (req, res, next) => {
    // let token = req.headers.authorization?.split(' ')[1];
    let token = req.cookies.token;
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        // console.log("check token :" + token)
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;

                assignJWT(req.user, res)
                // req.user = {user: decoded.user};

                next();
            }
        });
    } else {
        return res.redirect('/connexion');
    }
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
    flushJWT
};