const Message = require("../classes/message");
const Utils = require("../libs/utils.js");
const fs = require("fs");
require("dotenv").config();

// Créer un message
exports.createMessage = (req, res, next) => {
    try {
        //console.log(req.body)
        const newMessage = new Message({
            user_id: req.body.user_id,
            title: req.body.title,
            content: req.body.content,
            image: req.file ? req.file.filename : null,
            users_like: JSON.stringify([]),
            users_dislike: JSON.stringify([]),
            date_add: Utils.getSqlDate(),
            date_update: Utils.getSqlDate(),
            isActive: true,
        });

        Message.create(newMessage, (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de créer le message" + err });
            }
            res.status(200).json(data);
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Updater un message
exports.updateMessage = (req, res, next) => {
    try {
        //console.log(req.body);
        let fileName = null;
        if (req.body.img != null) {
            fileName = req.body.img;
        }
        const newMessage = new Message({
            user_id: req.body.user_id,
            title: req.body.title,
            content: req.body.content,
            image: req.file ? req.file.filename : fileName,
            date_update: Utils.getSqlDate(),
            isActive: true,
        });

        Message.updateOne(newMessage, req.body.idMessage, (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de metre à jour le message" });
            }
            res.status(200).json(data);
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Récupérer tous les messages
exports.getAllMessages = (req, res, next) => {
    try {
        Message.findAllWithComments((err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de récupérer les messages" });
            }
            let newData = [];
            let currentId = -1;
            let i = -1;

            data.forEach((message) => {
                let nbC = 0;
                message.dateUpdate = dato(message.date_update);
                message.img = null;
                if (message.image != null) {
                    message.img =
                        process.env.URL +
                        "/" +
                        process.env.DIR +
                        "/" +
                        message.image;
                }
                message.users_like = JSON.parse(message.users_like);
                message.users_dislike = JSON.parse(message.users_dislike);
                if (currentId != message.id) {
                    i++;
                    currentId = message.id;
                    newData[i] = { ...message };
                    newData[i].tabComments = [];
                }
                if (message.comment_id != null) {
                    newData[i].tabComments.push({
                        comment_id: message.comment_id,
                        comment_pseudo: message.comment_pseudo,
                        comment_content: message.comment_content,
                    });
                }
                newData[i].nbComments = newData[i].tabComments.length;
            });
            res.status(200).json(newData);
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Récupére un  message
exports.getOneMessage = (req, res, next) => {
    try {
        Message.findOne(req.params.id, (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de récupérer le message" });
            }
            if (data != undefined) {
                data.img =
                    process.env.URL + "/" + process.env.DIR + "/" + data.image;
                console.log(data);
            }
            res.status(200).json(data);
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Supprimer un message
exports.deleteMessage = (req, res, next) => {
    try {
        Message.findOne(req.params.id, (err, data) => {
            if (req.body.image) {
                const filename = data.image.split("/images/")[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) {
                        res.status(500).send({
                            message: err,
                        });
                    }
                });
            }
            Message.delete(req.params.id, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: "Impossible de supprimer le message",
                    });
                } else {
                    res.send({ message: "Le message a été supprimé" });
                }
            });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Ajouter une réaction
exports.createReaction = (req, res, next) => {
    try {
        // let myToken = Utils.getReqToken(req);

        // if(myToken.id != req.body.user_id){ // check pas dusurpation de user_id
        //   return res.status(401).json({ message: "Non authorise" });
        // }

        const newReaction = {
            user_id: req.body.user_id,
            message_id: req.body.message_id,
            reaction_id: req.body.reaction_id,
        };

        Message.findOne(newReaction.message_id, (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "1Impossible d'ajouter la réaction" });
            }
            console.log(data);
            if (newReaction.reaction_id == 1) {
                // Ajouter à like
                let tab = JSON.parse(data.users_like);
                tab.push(newReaction.user_id);
                data.users_like = JSON.stringify(tab);
            } else if (newReaction.reaction_id == -1) {
                // ajouter à dislike
                let tab = JSON.parse(data.users_dislike);
                console.log(typeof tab);
                tab.push(newReaction.user_id);
                data.users_dislike = JSON.stringify(tab);
            } else if (newReaction.reaction_id == 0) {
                const tub = JSON.parse(data.users_dislike);
                const tib = JSON.parse(data.users_like);
                if (tub.includes(newReaction.user_id)) {
                    // enlever à dislike
                    let myIndex = tub.indexOf(newReaction.user_id);
                    tub.splice(myIndex, 1);
                    data.users_dislike = JSON.stringify(tub);
                    //Update DB
                } else if (tib.includes(newReaction.user_id)) {
                    /// enlever à like
                    let myIndex = tib.indexOf(newReaction.user_id);
                    tib.splice(myIndex, 1);
                    data.users_like = JSON.stringify(tib);
                    //Update DB
                }
            }
            Message.updateReactions(
                newReaction.message_id,
                data,
                (err, data) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ message: "2Mise à jour impossible" });
                    }
                    res.send({ message: "Réaction mise à jour" });
                }
            );
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

function dato(dbDate) {
    var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    var today = new Date(dbDate); // date envoyée par ta base de données
    return today.toLocaleDateString("fr-FR", options);
}
