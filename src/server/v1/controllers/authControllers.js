const router = require('express').Router()
const { genPassword, authLocal }  = require('../libs/passportUtils');
const { guestHandler }            = require('../libs/handlerUtils');

const db = require('../models/models');
const { User, UserStats } = db.collections;

router.get('/guest', guestHandler, (req, res) => { res.redirect('/explore') })

router.post('/login', authLocal, guestHandler, (req, res) => {
    res.json({ isAllow: true })
})

router.post('/register', (req, res, next) => {
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
                numOfPuzzlesCreated: 0,
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
}, authLocal, guestHandler, ( req, res ) => {
    res.json({isAllow: true})
})

router.get('/logout', (req, res, next) => {
    if (!req.user){
        return res.redirect("/explore") // Not Authenticated to logout
    }

    req.logOut((err) => {
        if(err) { return next(err) }
        res.redirect('/')
    });
})

module.exports = router;