const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    ref: {
        type: String,
    }
});

const Transactions = mongoose.model('Transactions', transactionSchema);
module.exports = {
    Transactions: Transactions,
    transactionSchema: transactionSchema,
}
