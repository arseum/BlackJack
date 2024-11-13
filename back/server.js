require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Connexion à la base de données
const connectDB = {};

// Importation des routes
const userRoutes = require('./route/userRoutes');
const tableRoutes = require('./route/tableRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tables', tableRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

connectDB();