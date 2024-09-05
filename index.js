require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const PORT = 8000;

const mongoURL = process.env.DATABASE_URL;

mongoose.connect(mongoURL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());

app.listen(PORT, ()  => {
    console.log("Server running on port:", PORT);
})

app.use('/api', routes);