const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const urlRoutes = require('./routes/url');

const app = express(); // Création de l'application express

const corsOptions = {
  origin: 'http://localhost:3000',  // Spécifie l'origine autorisée
  credentials: true,  // Autorise les cookies
};

app.use(cors(corsOptions)); // Utilisation du middleware CORS avec les options spécifiques

// Middleware pour traiter les données JSON
app.use(express.json());

// Connexion à MongoDB locale
mongoose.connect('mongodb://localhost:27017/block_that', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Définition des routes
app.use('/api/url', urlRoutes);
app.use('/api/user', userRoutes);

module.exports = app;