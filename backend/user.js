const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');

const User = require("../models/user");

const createUser = (username, password) => {
  return new Promise(function(resolve, reject) {
    if (!(username && password)) {
      reject("Username and password cannot be empty");
      return;
    }

    User.findOne({ username: username }, (err, dbuser) => {
      if (err) {
        reject("CreateUser: An error has occured");
        return;
      }

      // Create user only if username is not taken
      if (dbuser) {
        reject(
          `The username ${username} is taken, please choose a different username`
        );
        return;
      }

      const newUser = new User({
        username,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser, err => {
            if(err) {
              reject(err);
              return;
            }
            resolve(newUser);
          })
        });
      });
    });
  });
};

// Login ish

const authenticateUser = function(username, password, done) {
  User.findOne({
    username: username
  }).then(user => {
    if (!user) {
      return done(null, false, { message: 'That username is not registered' });
    }
    // Match password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done();
      }
    });
  })
};


module.exports = {
  createUser,
  authenticateUser
}
