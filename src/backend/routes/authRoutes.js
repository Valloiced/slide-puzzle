const app      =  require('express')()
const passport = require('passport');
const path     = require('path');

const { genPassword } = require('../libs/passportUtils')
const db              = require('../config/connection')
const { User, UserStats } = db.collections

const auth = passport.authenticate('local', { failureRedirect: "/failed" })

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/startup.html"));
})

app.get('/guest', (req, res) => {
    //TODO
})

app.get('/check', (req, res) => {
    console.log(req.session)
    res.json({isAuth: req.isAuthenticated()})
})


app.post('/login', auth, (req, res) => {
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
}, auth, ( req, res ) => {
    res.json({isAllow: true})
})

app.get('/failed', (req, res, next) => {
    res.json({isAllow: false, err: req.err})
})

app.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) { return next(err) }
        res.redirect('/')
    });
})

module.exports = app;