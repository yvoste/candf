const passwordSchema = require('../constraints/Password');                      // Importation des contraintes de mot de passe

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({error: 'Mot de passe trop simple !' });
    } else {
        next();
    }
};