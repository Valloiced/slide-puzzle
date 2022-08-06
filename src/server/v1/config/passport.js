const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isValid }   = require('../libs/passportUtils');

const db = require('../models/models');
const { User }= db.collections;


/** Serializer */

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
        if(err) { return done(err) }
        
        return done(null, user)
    })
});


/** Local Strategy */
let localAuth = (username, password, done) => {

    User.findOne({username: username}, (err, user) => {
        if(err) { return done(err) }
        if(!user) {
            return done(null, false)
        } 
  
        let isAllowed = isValid(user.password, user.salt, password)

        if(isAllowed) {
            return done(null, user)
        } 

        return done(null, false)
        
    })
}

passport.use(new LocalStrategy(localAuth))
