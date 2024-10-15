const express = require('express');
const { Users } = require('../model/user.model');
const createError = require('http-errors');
const { authSchema, signupSchema } = require('../helper/validationSchema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helper/jwt_helper');

const loginAPI = express.Router()

loginAPI.post('/signup', async (req, res, next) => {
    try {
        const { username, password, name } = req.body;
        console.log(req.body)
        const result = await signupSchema.validateAsync(req.body);

        if (!username || !password || !name) {
            throw createError.BadRequest();
        }

        const doesExist = await Users.findOne({ username: result.username });
        if (doesExist) {
            throw createError.Conflict(`${username} already exists`);
        }
        const user = new Users(result);
        const data = await user.save();

        const tokens = await signAccessToken(data._id);

        res.status(200).send({tokens, data})
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

loginAPI.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authSchema.validateAsync(req.body);
        if (!username || !password) {
            throw createError.BadRequest('Invalid Username/Password');
        }
        const user = await Users.findOne({ username: result.username });
        if (!user) {
            throw createError.NotFound('User not found');
        }
        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) {
            throw createError.Unauthorized();
        }
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        res.json({accessToken, refreshToken,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                money: user.money,
                transactions: user.transactions
            }
        });
    } catch (error) {
        next(error)
    }
    
})

loginAPI.post('/logout', async (req, res, next) => {

})

loginAPI.post('refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createError.BadRequest();
        }
        const result = await verifyRefreshToken(refreshToken);
        if (!result) {
            throw createError.Unauthorized();
        }
        const accessToken = await signAccessToken(result);
        const newRefreshToken = await signRefreshToken(result);
        res.send({accessToken: accessToken, refreshToken: newRefreshToken})
    } catch (error) {
        next(error)
    }
})

module.exports = loginAPI