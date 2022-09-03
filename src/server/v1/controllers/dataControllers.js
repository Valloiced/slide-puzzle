const dataRouter = require('express').Router()
const db = require('../models/models')
const { Puzzle } = db.collections

dataRouter.get('/get_user', (req, res) => {
    if(!req.user){ return res.redirect('/data/status') }
    
    let { username, id, profileImg, joinedOn, UserStatsID } = req.user

    if(profileImg){
        profileImg = Buffer.from(profileImg).toString('ascii')
    }
    
    res.json({
        user: { 
            userId: id,
            username: username, 
            u_statsId: UserStatsID,
            profileImage: profileImg || null,
            joinedOn: joinedOn
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