const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                sub: userID
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1d',
                issuer: 'Expense Tracker',
                audience: userID.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) { reject(err) }
                resolve(token)
            })
    })},
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) {
            return next(createError.Unauthorized())
        }
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized())
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = { }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'Expense Tracker',
                audience: userID.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) { reject(err) }
                resolve(token)
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    return reject(createError.Unauthorized())
                }
                const userID = payload.aud
                resolve(userID)
            })
        })
    }
}