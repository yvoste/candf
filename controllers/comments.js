const Comment = require("../classes/comment");
const Utils = require("../libs/utils.js");

// Créer un comment
exports.createComment = (req, res, next) => {
    try {
        const newComment = new Comment({
            user_id: req.body.user_id,
            message_id: req.body.message_id,
            comment: req.body.commentInput,
            createdAt: Utils.getSqlDate(),
            updatedAt: Utils.getSqlDate(),
        });

        Comment.create(newComment, (err, data) => {
            if (err) {
                return res.status(400).json({
                    message: "From Back Impossible de créer le commentaire",
                });
            }
            Comment.latest((err, result) => {
                res.send({
                    message_id: result.message_id,
                    comment_id: result.id,
                    comment_pseudo: result.pseudo,
                    comment_content: result.comment,
                });
            });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Récupérer tous les commentaires
exports.getAllMessageComment = (req, res, next) => {
    try {
        Comment.findAllMessageComment((err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Impossible de récupérer les messages" });
            }
            res.status(200).json(data);
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};

// Supprimer un comment
exports.deleteComment = (req, res, next) => {
    try {
        Comment.delete(req.params.id, (err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Comment non supprimé" });
            }
            res.status(200).json({ message: "Le comment a été supprimé !" });
        });
    } catch (err) {
        res.status(400).json({ message: "Un problème est survenu!" });
    }
};
