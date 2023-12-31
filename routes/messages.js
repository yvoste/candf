const express = require('express');                                     // Importation du framework Express
const router = express.Router();                                        // Méthode router() d'express
const auth = require('../middleware/auth');         // Importation du middleware d'authentification
const multer = require('../middleware/multer-config');
const messageControllers = require('../controllers/messages');          // Importation du controlleur Message

// CRUD
router.post('/', auth, multer, messageControllers.createMessage);
router.put('/', auth, multer, messageControllers.updateMessage);
router.get('/', auth, messageControllers.getAllMessages);
router.get('/:id', auth, messageControllers.getOneMessage);
router.post('/:id/reactions', auth, messageControllers.createReaction);
router.delete('/:id', auth, messageControllers.deleteMessage);

module.exports = router;