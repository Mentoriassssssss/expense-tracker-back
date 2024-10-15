require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const transactionsAPI = require('./routes/transactions.js');
const morgan = require('morgan');
const createError = require('http-errors');
const loginAPI = require('./routes/auth.js');
const {verifyAccessToken} = require('./helper/jwt_helper');
const cors = require('cors');

const PORT = 8000;

const mongoURL = process.env.DATABASE_URL;

mongoose.connect(mongoURL, {
    dbName: 'ExpenseTracker',
});

const database = mongoose.connection;

database.on('error', (error) => { 
    console.log(error)
})

database.once('connected', () => {
    console.log('Connect to database successfully');
})

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, ()  => {
    console.log("Server running on port:", PORT);
})

app.get('/', verifyAccessToken, async (req, res) => {
    res.send('Home')
})

app.use('/api', transactionsAPI);
app.use('/auth', loginAPI);

app.use(async (req, res, next) => {
    next(createError.NotFound('This route does not exist.'));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
})