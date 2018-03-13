const express = require('express'); // require the express module
const router = express.Router(); // instantiate a new router on the express module
const User = require('../models/user'); // require 'user.js' in the 'models' directory

// get method is used to handle the GET requests to the specified path
router.get('/register', (req, res, next) =>
{// callback will run when the client requests this route
    return res.render('registration', { title: "Sign Up" }); // compile pug template into HTML, extension specification not required since view engine has already been set to 'pug'
});

// get method is used to handle the GET requests to the specified path
router.get('/login', (req, res, next) =>
{// callback will run when the client requests this route
    return res.render('login', { title: "Log In" }); // compile pug template into HTML, extension specification not required since view engine has already been set to 'pug'
});

// get method is used to handle the GET requests to the specified path
router.get('/playlist', (req, res, next) =>
{// callback will run when the client requests this route
    
    if (! req.session.userID)
    {
        var err = new Error("You are not authorized to view this page."); // Error constructor with a string passed in, assigned to 'err'
        err.status = 403;

        return next(err); // signals the end of a middleware function, pass in the 'err' object as an argument to the next function call
    }

    User.findById(req.session.userId).exec((error, user) =>
    {
        if (error)
        {
            return next(error);
        } else
          {
              return res.render('playlist', { title: 'Playlist', name: user.name, favorite: user.favoriteALBUM });
          }
    });
});

// post method requests to the specified path with the specified callback function(s)
router.post('/login', (req, res, next) =>
{// callback will run when the client requests this route
 
    if (req.body.email && req.body.password) // conditional statement to check if both coditions are true
    {
        User.authenticate(req.body.email, req.body.password, (error, user) =>
        {
            if (error || !user)
            {
                var err = new Error("Invalid email or password entered."); // Error constructor with a string passed in, assigned to 'err'
                err.status = 401;

                return next(err); // signals the end of a middleware function, pass in the 'err' object as an argument to the next function call
            } else
            {
                req.session.userID = user._id;

                return res.redirect('/profile'); // treehouse project page
                return res.redirect('/playlist'); // my project page
            }
        });
    } else
      {
          var err = new Error("Email and Password fields are required."); // Error constructor with a string passed in, assigned to 'err'
          err.status = 400;

          return next(err); // signals the end of a middleware function, pass in the 'err' object as an argument to the next function call
      }
});

// post method requests to the specified path with the specified callback function(s)
router.post('/register', (req, res, next) =>
{// callback will run when the client requests this route
    if (req.body.name && req.body.email && req.body.password && req.body.confirmPassword) // conditional statement to check if all fields are true
    {
        if (req.body.password != req.body.confirmPassword) // conditional statement to check if the password fields match
        {
            var err = new Error("Passwords do not match."); // Error constructor with a string passed in, assigned to 'err'
            err.status = 400;

            return next(err); // signals the end of a middleware function, pass in the 'err' object as an argument to the next function call

            const userData = // create object with form input
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            };

            // use schema's 'create' method to insert document into Mongo
            User.create(userData, (error, user) =>
            {
                if (error)
                {
                    return next(error); // signals the end of a middleware function
                } else
                  {
                      req.session.userID = user._id;

                      return res.redirect('/profile'); // treehouse project page
                      return res.redirect('/playlist'); // my project page
                  }
            });
        }
    } else
      {
          var err = new Error("All fields required."); // Error constructor with a string passed in, assigned to 'err'
          err.status = 400;

          return next(err); // signals the end of a middleware function, pass in the 'err' object as an argument to the next function call
      }
});

// get method is used to handle the GET requests to the specified path
router.get('/', (req, res, next) =>
{// callback will run when the client requests this route
});

// get method is used to handle the GET requests to the specified path
router.get('/about', (req, res, next) =>
{// callback will run when the client requests this route
});

// get method is used to handle the GET requests to the specified path
router.get('/contact', (req, res, next) =>
{ // callback will run when the client requests this route
});

module.exports = router; // export to be referenced in other files