const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

module.exports.registration =  async (email,password) => {
    const hashPassword = await bcrypt.hash(password,10);
    return (await (User.create({
        email,
        password: hashPassword
    }))).toJSON()
}

module.exports.compareUserPassword =  async (inputPassword, user) => {
    return bcrypt.compare(inputPassword,user.password);
}

module.exports.createUserToken =  async (user) => {
    return jwt.sign(
        { user_id: user.id },
        process.env.JWT_PRIVATE_KEY,
        {
            algorithm: 'HS256'.toString(),
            expiresIn: '10m'
        }
    );
}

module.exports.createRefreshToken = (user) => {
    return jwt.sign(
        { user_id: user.id },
        process.env.JWT_PRIVATE_KEY,
        {
            expiresIn: '1d',
        }
    );
}