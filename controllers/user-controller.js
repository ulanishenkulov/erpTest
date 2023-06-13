const Joi = require('joi');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userService = require("../services/userService");
const BlacklistedToken = require("../models/blackListedToken");

module.exports.signUp = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(10).required()
    });
    const { value, error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    try {
        const user =  await userService.registration(value.email,value.password);
        const accessToken = await userService.createUserToken(user);
        const refreshToken = await userService.createRefreshToken(user);
        return res.json({accessToken,refreshToken});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports.signIn = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(10).required()
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    try {
        const user = await User.findOne({email: value.email});

        if (!user) {
            return res.status(404).send({message:"Not Found"});
        }

        const isPasswordTrue = await userService.compareUserPassword(value.password, user);

        if (!isPasswordTrue) {
            return res.status(404).send({message:"Wrong Password"});
        }
        // in signIn i gave both accessToken and refreshToken.
        // Client will use refreshToken to get new accessToken,
        // if both of them are expired, client will request singIn url and get both of them.
        const accessToken = await userService.createUserToken(user);
        const refreshToken = await userService.createRefreshToken(user);
        return res.json({accessToken,refreshToken});
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'An error occurred while creating the user' });
    }
};

module.exports.createNewAccessToken = async (req, res) => {
    try {
        // here as a token client will give refreshToken and get accessToken.
        const token = await userService.createUserToken(req.user);
        return res.json({token});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


module.exports.getUserEmail = async (req, res) => {
    try {
        return res.json({email: req.user.email});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports.logOut = async (req, res) => {
    try {
        const blackListedToken = req.headers?.authorization?.split(' ')[1];
        // old token will become black listed.
        await BlacklistedToken.create({ token: blackListedToken });
        const newToken = await userService.createUserToken(req.user);
        return res.json({token:newToken});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



