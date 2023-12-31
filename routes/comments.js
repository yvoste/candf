const express = require("express");                                     // Importation du framework Express
const router = express.Router();                                        // Méthode router() d'express
const auth = require('../middleware/auth');                             // Importation du middleware d'authentification
const commentControllers = require('../controllers/comments');          // Importation du controlleur Comment

router.post('/', auth, commentControllers.createComment);
router.get('/:id', auth, commentControllers.getAllMessageComment);
router.delete('/:id', auth, commentControllers.deleteComment);

module.exports = router;