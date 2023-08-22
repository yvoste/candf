const db = require('./db');

const User = function(user) {
    this.pseudo=user.pseudo,
    this.email=user.email,
    this.bio=user.bio,
    this.password=user.password,
    this.avatar=user.avatar,
    this.isAdmin=!!user.isAdmin,
    this.isActive=!!user.isActive
};


User.create = (newUser, result) => {
    db.query(`INSERT 
              INTO users 
              SET ?`, 
              newUser, (err, res) => {
        if(err) {
            result(err, null);
        } else {
            console.log(newUser);
            result(null, {
                id:res.insertId,
                ...newUser
            });
        }
    })
};


User.findOneByEmail = (email, result) => {
    db.query(`SELECT * 
              FROM users 
              WHERE email = ?
              AND isActive = true`, 
              [email] , (err, res) => {
        if(err) {
            result(err, null);
        } else{             
            result(null, res[0]);
        }
    });
};


User.findOneById = (id, result) => {
    db.query(`SELECT * 
              FROM users 
              WHERE id=?
              AND isActive=true`, 
              id, (err, res) => {
        if(err) {console.log(err)  
            result(err, null);
        } else {
            console.log(err) 
            result(null, res[0])
        }        
    });
};


User.findAll = (result) => {
    db.query(`SELECT * 
              FROM users
              WHERE isActive=true`, 
              (err, res) => {
        if(err) {
            result(err, null);
        } else {
            result(null, res)
        }        
    });
};


User.modifyProfil = (user, result) => {
    db.query(`UPDATE users 
              SET pseudo = ?, bio =?
              WHERE id = ?
              AND isActive = true`, 
              [user.pseudo, user.bio, user.id], (err, res) => {
        if(err) {
            result(err, null);
        } else {
            result(null, res)
        }
    });
};


User.modifyAvatar = (user, result) => {
    db.query(`UPDATE users 
              SET avatar=? 
              WHERE id=?
              AND isActive=true`, 
              [user.avatar, user.id], (err, res) => {
        if(err) {
            result(err, null);
        } else {
            result(null, res)
        }
    });
};

User.deactivate = (id, result) => {
    console.log(id+'___id')
    db.query(`UPDATE users
              SET isActive = false
              WHERE id = ?`, 
              id, (err, res) => {
        if(err) {
            result(err, null);
        } else {
            result(null, res)
        }
    });
};

 module.exports = User;