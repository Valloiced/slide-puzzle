let passport = require('passport');
let app      = require('express')();

let ensureAuthenticated = (req, res, next) => {

    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    return next()
}

let authLocal = passport.authenticate('local', {failureRedirect: "/failed"})

app.get('/failed', (req, res, next) => {
    res.json({ isAllow: false })
})

module.exports = { ensureAuthenticated, authLocal }