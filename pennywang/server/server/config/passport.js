var session = require("express-session")
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose')

require('./db-config')
require('../models/user-schema')

module.exports = function (server) {

server.use(session({secret: 'w81s$andw81seuro',
                    resave: true,
                    saveUninitialized: true
}));
server.use(passport.initialize());
server.use(passport.session());

const usersDB = mongoose.model('User');

//passport-local strategy
passport.use(new localStrategy(
    function (username, password, done) {
      
        usersDB.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !=password){
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
    ));
    
     //passport js user serialization
     passport.serializeUser(function (user, next) {
    
        next(null, user._id);
    
    });
    
    // passport js user deserialization
    
    passport.deserializeUser(function (id, done) {
    
        usersDB.findById(id, function (err, user) {
            done(err, user);
        });
        });
    }