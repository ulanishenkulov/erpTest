const User = require('../models/user');
const jwt = require('jsonwebtoken');
const BlacklistedToken = require("../models/blackListedToken");
require('dotenv').config();

module.exports = async function (req, res, next) {
    const auth = req.headers?.authorization;

    if (!auth) {
        return res.status(401).send({message:"Unauthorized"});
    }

    const token = auth.split(' ')[1];

    if (!token) {
        return res.status(401).send({message:"Unauthorized"});
    }

    let decodeValue;

    try {
        const blackListedToken = await BlacklistedToken.findOne({ where: { token: token } });

        if (blackListedToken) {
            return res.status(401).send({message:"Token is blacklisted"});
        }
        decodeValue = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    } catch (err) {
        return res.status(401).send({message:err.message});
    }
    const user = (await User.findByPk(decodeValue.user_id)).get();

    if (!user) {
        return res.status(401).send({message:"Unauthorized"});
    }
    req.user = user;

    return next();
}