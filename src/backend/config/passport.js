const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isValid }   = require('../libs/passportUtils');

const db = require('./connection');
const { User }= db.collections;

/** Local Strategy */
let localAuth = (username, password, done) => {
    console.log(username, password)

    User.findOne({username: username}, (err, user) => {

        if(err) { done(err) }
        if(!user) {
            return done(null, false)
        } 

        let isAllowed = isValid(user.password, user.salt, password)

        if(isAllowed) {
            return done(null, user)
        } else {
            return done(null, false)
        }

    })
}

passport.use(new LocalStrategy(localAuth))


/** Serializer */

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
        if(err) { done(err) }
        
        done(null, user)
    })
});