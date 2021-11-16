// constantes
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');

// package pour optimiser et sécuriser les headers
app.use(helmet())

/// importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

/// Connexion avec la base de donnée mongodB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PW}
@cluster0.3neqo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout des headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// permet de parser les données reçues en json
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes)


module.exports = app;