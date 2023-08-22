const express = require('express');                                         
const path = require('path');                                               // Importation du package path :
const helmet = require('helmet');                                           // Importation du package helmet :
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();

const messageRoutes = require("./routes/messages");                         // Importation des routes messages
const commentRoutes = require("./routes/comments");                         // Importation des routes comments
const userRoutes = require("./routes/user");                                // Importation des routes user

const app = express(); 
const PORT = '8080';
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials : true
};
// Then pass them to cors:
app.use(cors(corsOptions));                                                    
// Application
console.log(corsOptions.origin);
// CORS : traitement des erreurs (middleware général, ajout des headers)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    res.setHeader(
      'Access-Control-Allow-Headers', 
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    res.setHeader('Access-Control-Allow-Credentials', true);
    next();    // Appel de next pour exécuter les autres fonctions
});

// Définition de la fonction json comme middleware global
app.use(cookieParser());
app.use(express.json()); 
                                              
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));                          


// Gestion de la source de manière statique grâce à Express
app.use('/images', express.static(path.join(__dirname, 'images')));        
// Activation de la protection Helmet : équivaut à 11 protections (req http)
app.use(helmet());
    
app.use("/api/messages", messageRoutes);                                   
app.use("/api/comments", commentRoutes);                                   
app.use("/api", userRoutes);

module.exports = app;                                                      