const bcrypt = require('bcrypt'); // require password hashing library
const mongoose = require('mongoose'); // require MongoDB object modeler for Node.js

const userSchema = new mongoose.Schema(
{
    name:
    {
        type: String, // type of data
        required: true, // enforce the presence of the specified field
        trim: true // remove any empty space before or after text is entered
    },

    email:
    {
        type: String, // type of data
        unique: true, // ensure provided object does not already exist in the database
        required: true, // enforce the presence of the specified field
        trim: true // remove any empty space before or after text is entered
    },

    password:
    {
        type: String, // type of data
        required: true // enforce the presence of the specified field
    }
});

//authenticate input against database documents
userSchema.statics.authenticate = (email, password, callback) =>
{
    User.findOne({ email: email }).exec((error, user) =>
    {
        if (error)
        {
            return callback(error);
        } else if (!user)
          {
              var err = new Error("User not found.");
              err.status = 401;

              return callback(err);
          }
        
        /*
        compare(data, encrypted, cb)
            data - [REQUIRED] - data to compare.
            encrypted - [REQUIRED] - data to be compared to.
            cb - [OPTIONAL] - a callback to be fired once the data has been compared. uses eio making it asynchronous. If cb is not specified, a Promise is returned if Promise support is available.
                err - First parameter to the callback detailing any errors.
                same - Second parameter to the callback providing whether the data and encrypted forms match [true | false].
        */
        bcrypt.compare(password, user.password, (error, result) =>
        {
            if (result === true)
            {
                return callback(null, user);
            } else
              {
                  return callback();
              }
        });
    });
}

// hash password before saving to database
userSchema.pre('save', (next) =>
{
    var user = this;

    /*
    hash(data, salt, cb)
        data - [REQUIRED] - the data to be encrypted.
        salt - [REQUIRED] - the salt to be used to hash the password. if specified as a number then a salt will be generated with the specified number of rounds and used.
        cb - [OPTIONAL] - a callback to be fired once the data has been encrypted. uses eio making it asynchronous. If cb is not specified, a Promise is returned if Promise support is available.
            err - First parameter to the callback detailing any errors.
            encrypted - Second parameter to the callback providing the encrypted form.
    */
    bcrypt.hash(user.password, 10, (err, hash) =>
    {
        if (err)
        {
            return next(err); // signals the end of a middleware function
        }

        user.password = hash;

        next();
    });
});

const User = mongoose.model('User', userSchema);
module.exports = User; // export to be referenced in other files