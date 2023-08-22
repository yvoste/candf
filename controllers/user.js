const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Importation du package jsonwebtoken
const User = require("../classes/user");
const db = require("../classes/db");

// function createToken(user, xsrfToken){
//   const token =  jwt.sign(
//     {id_user: user.id_user, pseudo: user.pseudo, xsrfToken: xsrfToken},
//     process.env.tokenSecret,
//     {expiresIn: parseInt(process.env.tokenLife)}
//   );
//   const refreshToken = jwt.sign(
//     { id_user: user.id_user, pseudo: user.pseudo},
//     process.env.refreshTokenSecret,
//     { expiresIn: parseInt(process.env.refreshTokenLife)}
//   );
//   return [token, refreshToken];
// }
// Inscription
exports.signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(
            req.body.password,
            Number(process.env.SALT)
        );
        const user = new User({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: hash,
            isActive: true,
        });
        User.create(user, async (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de créer l'utilisateur" });
            }

            console.log(User.id);
            const token = jwt.sign(
                { userId: data.id },
                `${process.env.tokenSecret}`,
                {
                    expiresIn: "24h",
                }
            );

            //res.cookie("token", token);
            res.cookie("moncook", token, {
                httpOnly: true,
                secure: false, // true only with https
                maxAge: parseInt(process.env.maxAge), // one year
            });

            data.avatar = null;
            console.log(data);
            //res.send(data);
            res.json({
                id_user: data.id,
                pseudo: data.pseudo,
                isAdmin: data.isAdmin,
                isActive: data.isActive,
                isConnect: true,
            });
        });
    } catch (err) {
        res.status(400).json({ err });
    }
};

// Connexion
exports.login = async (req, res, next) => {
    // TODO check if email is valid before test in DB
    try {
        User.findOneByEmail(req.body.email, async (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Utilisateur non trouvé" });
            }
            if (!result || result.length == 0) {
                return res.status(404).json({
                    message: "Aucun compte associé à cette adresse e-mail!",
                });
            }

            const valid = await bcrypt.compare(
                req.body.password,
                result.password
            );
            if (!valid) {
                return res
                    .status(401)
                    .json({ message: "Mot de passe invalide" });
            }
            console.log(result);
            const token = jwt.sign(
                { userId: result.id },
                `${process.env.tokenSecret}`,
                {
                    expiresIn: "24h",
                }
            );

            //res.cookie("token", token);
            res.cookie("moncook", token, {
                httpOnly: true,
                secure: false, // true only with https
                maxAge: parseInt(process.env.maxAge), // one year
            });

            let profile = result.avatar ? result.avatar : "";
            res.status(200).json({
                pseudo: result.pseudo,
                id_user: result.id,
                avatar: profile,
                bio: result.bio,
                isAdmin: result.isAdmin,
                isActive: result.isActive,
                isConnect: true,
            });
        });
    } catch (err) {
        res.status(400).json({
            error: err,
            message: "Un problème est survenu!",
        });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    try {
        User.findAll((err, result) => {
            if (err) {
                return res
                    .status(404)
                    .json({ message: "Utilisateurs non trouvés" });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Réupérer un seul user
exports.getOneUser = (req, res, next) => {
    try {
        let id = req.params.id;
        User.findOneById(id, (err, result) => {
            //console.log(result)
            if (err) {
                return res
                    .status(404)
                    .json({ message: err + "Utilisateur non trouvé" });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Mofifier un pseudo
exports.updateOneUserPseudo = (req, res, next) => {
    try {
        let user = {
            id: req.params.id,
            pseudo: req.body.pseudo,
            bio: req.body.bio,
        };
        //console.log(user)
        User.modifyProfil(user, (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Modification non effectuée" + err });
            }
            res.status(201).json({
                pseudo: user.pseudo,
                bio: user.bio,
            });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Mofifier une avatar
exports.updateOneUserFile = (req, res, next) => {
    try {
        let user = {
            id: req.params.id,
            avatar: req.file ? req.file.filename : null,
        };
        User.modifyAvatar(user, (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "BACK Modification non effectuée" });
            }
            res.status(201).json({ avatar: req.file.filename });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Supprimer un user
exports.deactivateUser = (req, res, next) => {
    try {
        console.log(req.params.id + "________________________DEACIVATE");
        User.deactivate(req.params.id, (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de supprimer l'utilisateur" });
            }
            res.status(204).json({
                message: "Utilisateur correctement supprimé",
            });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};
