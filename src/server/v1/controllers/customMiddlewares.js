let passport = require('passport');
let app      = require('express')();

let ensureAuthenticated = (req, res, next) => {

    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    return next()
}

/** To remove the guest attribute if the user logins or add it if */
let guestHandler = (req, res, next) => {
    if( req.session.guest || req.user ) {
        req.session.guest = false
        return next()
    } 

    req.session.guest = true
    return next()
}

let authLocal = passport.authenticate('local', {failureRedirect: "/failed"})

app.get('/failed', (req, res, next) => {
    res.json({ isAllow: false })
})



module.exports = { ensureAuthenticated, guestHandler, authLocal }