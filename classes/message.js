const db = require("./db");

// Création classe Message
const Message = function (message) {
  (this.user_id = message.user_id),
    (this.title = message.title),
    (this.content = message.content),
    (this.image = message.image),
    (this.users_like = message.users_like),
    (this.users_dislike = message.users_dislike),
    (this.date_add = message.date_add),
    (this.date_update = message.date_update),
    (this.isActive = !!message.isActive); // test si la variable exist et si elle a une valeur
};

// Créer un message
Message.create = (newMessage, result) => {
  console.log(newMessage);
  db.query(
    `INSERT 
        INTO messages 
        SET ?`,
    newMessage,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, {
        id: res.insertId, // insert nouvel ID dans newMessage
        ...newMessage,
      });
    }
  );
};

// Mettre à jour un message
Message.updateOne = (newMessage, idMsg, result) => {
  console.log(newMessage);
  db.query(
    `UPDATE messages
              SET title = ?, content = ?, image = ?, date_update = ?, isActive = ?
              WHERE id = ?`,
    [
      newMessage.title,
      newMessage.content,
      newMessage.image,
      newMessage.date_update,
      newMessage.isActive,
      parseInt(idMsg),
    ],
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Trouver un message
Message.findOne = (id, result) => {
  db.query(
    `SELECT * 
              FROM messages 
              WHERE id=?
              AND isActive=true`,
    id,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, res[0]);
      }
    }
  );
};

// Trouver tous les messages avec commentaires
Message.findAllWithComments = (result) => {
  db.query(
    `SELECT messages.*, 
              users.pseudo, users.avatar, 
              comments.id AS comment_id, 
              user_comment.pseudo AS comment_pseudo, 
              comments.comment AS comment_content
              FROM messages 
              LEFT JOIN users ON messages.user_id = users.id
              LEFT JOIN comments ON messages.id = comments.message_id
              LEFT JOIN users AS user_comment ON comments.user_id = user_comment.id
              WHERE messages.isActive=true
              AND users.isActive = true 
              ORDER BY messages.date_update DESC;`,
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Supprimer un message (passe isActive à 0)
Message.delete = (id, result) => {
  db.query(
    `UPDATE messages
              SET isActive = 0 
              WHERE id = ?`,
    id,
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
// Modifier la réaction dun message
Message.updateReactions = (id, mata, result) => {
  db.query(
    `UPDATE messages
            SET users_like = ?, users_dislike = ?
            WHERE id = ?`,
    [mata.users_like, mata.users_dislike, parseInt(id)],
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Message;
