import { mongo } from 'mongoose';

// global scope
"use strict"; // indicate that the code should be executed in "strict mode"

const path = require('path');
const express = require('express'); // require the Express module
const bodyParser = require('body-parser'); // require Node.js' body parsing middleware
const cookieParser = require('cookie-parser'); // require Express.js' cookie parsing middleware
const config = require('./config');
const router = require('./routes');
const session = require('express-session'); //  require Express.js' session middleware
const mongoose = require('mongoose'); // require MongoDB object modeler for Node.js

const FileSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    created_at: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
});

// connect to MongoDB to utilize database
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

// import all models
require('./models/file.model.js');

const app = express(); // express function returns an express application, assigned to the variable 'app'

const publicPath = path.resolve(__dirname, '../public');
app.use(bodyParser.json()); // parse incoming requests
app.use(express.static(publicPath));
app.use('/api', router);

function createPost(req, res)
{
    var post = req.body;

    console.log(post);

    PostModel.create(post);

    res.json(post);
}

// (error, req, res, next) => {} is an error handling middleware function
app.use((req, res, next) =>
{
    var err = new Error("Not Found"); // Error constructor with a string passed in, assigned to 'err'
    err.status = 404;

    next(err); // signals the end of a middleware function, pass in the 'error' object as an argument to the next function call
});

// (error, req, res, next) => {} is an error handling middleware function
app.use((err, req, res, next) =>
{
    res.status(err.status || 500);

    res.json({ error: { message: err.message } });
});

app.listen(config.port, function()
{
    console.log(`${config.appName} is listening on port ${config.port}`);
});