const Joi = require('@hapi/joi');
const joiDate = require("@joi/date");
const joi = Joi.extend(joiDate);

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(4).required(),
});

const signupSchema = authSchema.keys(
    {
        name: Joi.string().required(),
    }
)

const transactionSchema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('Income', 'Expense').required(),
    amount: Joi.number().required(),
    date: joi.string().required(),
    ref: Joi.string()
});

module.exports = {
    authSchema,
    signupSchema,
    transactionSchema,
}