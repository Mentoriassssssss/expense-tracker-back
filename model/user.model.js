const mongoose = require('mongoose');

const { transactionSchema } = require('./transaction.model');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    transactions: [transactionSchema]
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

const Users = mongoose.model('Users', userSchema);
module.exports = {
    Users: Users,
    userSchema: userSchema,
}