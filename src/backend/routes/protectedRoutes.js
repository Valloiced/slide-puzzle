const express  = require('express');
const path     = require('path');
const passport = require('passport');

const db       = require('../config/connection');
const { User, Puzzle, UserGameSession } = db.collections

const app = express()

app.get('/getUser', (req, res) => {

    let { username, id, profileImg } = req.user
    
    res.json({
        user: { 
            userId: id,
            username: username, 
            profileImage: profileImg || null
    }})
})

app.get('/puzzles', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/userPuzzles.html"))
})

//TODO
app.get('/puzzles/:userId', (req, res) => {
    let { userId } = req.params
    console.log(req.params)

    res.json({
        puzzles: userId
    })
})

module.exports = app



