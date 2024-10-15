const express = require('express');
const { Transactions } = require('../model/transaction.model');
const { transactionSchema } = require('../helper/validationSchema');
const { verifyAccessToken } = require('../helper/jwt_helper');
const createError = require('http-errors');
const mongoose = require('mongoose');

const transactionsAPI = express.Router()

transactionsAPI.get('/', async (req, res, next) => {
    res.send('Api routes for transactions')
})

transactionsAPI.get('/getAllTransactions', verifyAccessToken, async (req, res, next) => {
    try {
        const data = await Transactions.find()
        if (!data) {
            throw createError.NotFound('No data found')
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.get('/getIncomes', verifyAccessToken, async (req, res, next) => {
    try {
        const data = await Transactions.find({type: 'Income'})
        if (!data) {
            throw createError.NotFound('No data found')
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.get('/getExpenses', verifyAccessToken, async (req, res, next) => {
    try {
        const data = await Transactions.find({type: 'Expense'})
        if (!data) {
            throw createError.NotFound('No data found')
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.get('/getTransaction/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw createError.BadRequest()
        }
        const id = new mongoose.Types.ObjectId(req.params.id)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError.BadRequest("ID not valid")
        }
        const data = await Transactions.findById(id)
        if (!data) {
            throw createError.NotFound('No data found')
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.get('/getTop3Transactions', verifyAccessToken, async (req, res, next) => {
    try {
        const data = await Transactions.find().sort({'created_at': -1}).limit(3)
        if (!data) {
            throw createError.NotFound('No data found');
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.post('/addTransaction', verifyAccessToken, async (req, res, next) => {
    try {
        if (!req.body) {
            throw createError.BadRequest()
        }
        const { title, type, amount, date, ref } = req.body;
        if (!title || !type || !amount || !date) {
            throw createError.BadRequest("Some fields are missing")
        }
        const result = await transactionSchema.validateAsync(req.body);
        const data = await new Transactions(result).save();
        
        res.status(201).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.delete('/deleteTransaction/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw createError.BadRequest();
        }
        const data = await Transactions.findByIdAndDelete(req.params.id)
        if (!data) {
            throw createError.NotFound('No data found');
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

transactionsAPI.patch('/updateTransaction/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw createError.BadRequest();
        }
        const data = await Transactions.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!data) {
            throw createError.NotFound('No data found');
        }
        res.status(200).json(data);
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error)
    }
})

module.exports = transactionsAPI;