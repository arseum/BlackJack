const { Pool } = require('pg');

const pool = new Pool({
    user: 'jack_daniel',
    host: 'localhost',
    database: 'blackjack',
    password: 'miel',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};