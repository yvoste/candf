const jwt = require("jsonwebtoken");
const db = require("../classes/db");

module.exports = (req, res, next) => {
    try {
        const { cookies } = req;

        if (!cookies || !cookies.moncook) {
            return res.status(401).json({
                message: "Cookie manquant",
            });
        }
        console.log(`${process.env.tokenSecret}`);
        const decodedToken = jwt.verify(
            cookies.moncook,
            `${process.env.tokenSecret}`
        );
        console.log(decodedToken);
        const userId = decodedToken.userId;
        console.log(userId);
        db.query(
            `SELECT * FROM users WHERE id = ?`,
            [userId],
            (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(500).json(err);
                } else if (!result[0])
                    return res
                        .status(401)
                        .json({ message: "Utilisateur non authorisé!" });
                else next();
            }
        );
    } catch (err) {
        res.status(401).json(err);
    }
};
