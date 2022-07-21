const app      =  require('express')();
const passport = require('passport');
const path     = require('path');

const { genPassword } = require('../libs/passportUtils');
const db              = require('../config/connection');
const { User, UserStats } = db.collections;

const { authLocal } = require('../controllers/customMiddlewares');

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/startup.html"));
})

app.get('/guest', (req, res) => {
    if(!req.user){
        req.session.guest = true
        res.redirect('/explore')
    }
    return res.redirect('/explore')
})

app.get('/check', (req, res) => {
    res.json({
        isGuest: req.session.guest,
        isLogin: req.isAuthenticated(),
    })
})

app.post('/login', authLocal, (req, res) => {
    if( req.session.guest ) req.session.guest = false
    res.json({ isAllow: true })
})

app.post('/register', (req, res, next) => {
    let { username, password } = req.body

    User.findOne({ username: username }, (err, user) => {
        if(err) { next(err) }
        else if(user) {
            next(null, false) 
        } 
        else {
            let hashPass = genPassword(password);
 
            /** Creating Default User Options */
            let newUser = new User({
                username: username,
                password: hashPass.hash,
                salt: hashPass.salt,
            })

            let newUserStat = new UserStats({
                userID: newUser._id,
                skillPoint: 0,
                numOfPuzzlesSolved: 0,
                bestTime: null,
                numOfFavorites: 0,
                numOfPiecesFinishedByGameSizes: [
                    {two: 0},
                    {three: 0},
                    {four: 0},
                    {five: 0},
                    {six: 0},
                    {seven: 0},
                    {eight: 0},
                    {nine:0},
                    {ten: 0}
                ]
            })

            newUser.UserStatsID = newUserStat._id

            newUserStat.save((err, doc) => {
                if(err) { next(err) }
            })

            newUser.save((err, doc) => {
                if(err) { next(err) }
                next(null, {
                    username: doc.username, 
                    password: doc.password,
                })
            })
        }
    })
}, authLocal, ( req, res ) => {
    if( req.session.guest ) req.session.guest = false
    res.json({isAllow: true})
})

app.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) { return next(err) }
        res.redirect('/')
    });
})

module.exports = app;