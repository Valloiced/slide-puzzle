const dataRouter = require('express').Router()
const db = require('../models/models')
const { Puzzle } = db.collections

dataRouter.get('/get_user', (req, res) => {
    if(!req.user){ return res.redirect('/data/status') }

    let { username, id, profileImg } = req.user
    
    res.json({
        user: { 
            userId: id,
            username: username, 
            profileImage: profileImg || null
    }})
})

dataRouter.get('/status', (req, res) => {
    res.json({
        isGuest: req.session.guest,
        isLogin: req.isAuthenticated(),
        in_game: req.session.in_game,
        redirect_to_puzzle: req.session.redirect_to_puzzle
    })
})

// dataRouter.get('/session')
// dataRouter.get('/puzzle')
// dataRouter.get('/p_stats')
// dataRouter.get('/leaderboard')

module.exports = dataRouter