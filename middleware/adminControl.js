// Middleware qui contrôle si le user connecté est admin
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Extraction du token du header authorization
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); 
    //console.log(decodedToken)        // Décodage du token
    //console.log(req.params.id)
    let role =0;
    if(decodedToken.isAdmin || decodedToken.id == req.params.id){
        next()
    } else {
        return res.status(403).json({ message: 'Eh non ! Vous n\'êtes pas autorisé à faire ça !'});
    }
};