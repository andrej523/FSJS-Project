import { mongo } from 'mongoose';

// global scope
"use strict"; // indicate that the code should be executed in "strict mode"

const bodyParser = require('body-parser'); // require Node.js' body parsing middleware
const express = require('express'); // require the Express module
const cookieParser = require('cookie-parser'); // require Express.js' cookie parsing middleware
const session = require('express-session'); //  require Express.js' session middleware
const mongoose = require('mongoose'); // require MongoDB object modeler for Node.js

const app = express(); // express function returns an express application, assigned to the variable 'app'
app.set("view engine", 'pug') // define template engine to use
app.set('views', __dirname + '/views');

// track login session(s)
app.use(session(
{
    secret: "I love programming in JavaScript :)", // sign the session ID cookie
    resave: true, // force the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false // force a session that is uninitialized to be saved to the store
}));

mongoose.connect('mongodb://localhost:27017/exampledatabase');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// (req, res, next) => {} is a middleware function
app.use((req, res, next) =>
{
    next(); // signals the end of a middleware function
});

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

const port = process.env.PORT || 3030; // specify port to serve app on

// start the app and listen on port 3030
app.listen(port, () =>
{
    console.log("The application is running on localhost:3030");
});