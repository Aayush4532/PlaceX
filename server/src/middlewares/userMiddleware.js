const jwt = require("jsonwebtoken");
const { connection } = require("../config/dbConnect.js");
require("dotenv").config();
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("Token is not present");

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { id } = payload;

        if (!id) {
            throw new Error("Invalid token");
        }

        const result = await connection.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        if (!result.rows.length) {
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if (IsBlocked)
            throw new Error("Invalid Token");

        req.result = result.rows[0];
        next();
    }
    catch (err) {
        res.status(401).send("Error: " + err.message)
    }

}


module.exports = {userMiddleware};