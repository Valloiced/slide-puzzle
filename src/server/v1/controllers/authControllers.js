const router = require('express').Router()
const { genPassword, authLocal }  = require('../libs/passportUtils');
const { guestHandler, bindToSession }            = require('../libs/handlerUtils');

const db = require('../models/models');
const { User, UserStats, Favorites } = db.collections;

router.get('/guest', guestHandler, (req, res) => { res.redirect('/explore') })

router.post('/login', authLocal, guestHandler, (req, res) => {
    if(!req.session.playTime){
        bindToSession({ playTime: 0 }, req)
    }

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
                playTime: 0,
                bestTime: 0,
                numOfPiecesFinishedByGameSizes: {
                    "2x2": 0,
                    "3x3": 0,
                    "4x4": 0,
                    "5x5": 0,
                    "6x6": 0,
                    "7x7": 0,
                    "8x8": 0,
                    "9x9": 0,
                    "10x10": 0,
                },
                bestTimeByGameSizes: {
                    "2x2": 0,
                    "3x3": 0,
                    "4x4": 0,
                    "5x5": 0,
                    "6x6": 0,
                    "7x7": 0,
                    "8x8": 0,
                    "9x9": 0,
                    "10x10": 0,
                }
            })

            let newFavorites = new Favorites({
                numOfFavorites: 0,
                favoritePuzzles: []
            })

            newUser.UserStatsID = newUserStat._id
            newUserStat.favoritesID = newFavorites._id

            newFavorites.save((err, doc) => {
                if(err) { next(err) }
            })

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
    if(!req.session.playTime){
        bindToSession({ playTime: 0 }, req)
    }
    
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