const app      =  require('express')();

const db              = require('../models/models');
const { User, UserStats, UserGameSession, Puzzle, PuzzleStats } = db.collections;

//TESTING PURPOSE (DANGEROUS CODE)
app.get('/deleteall', (req, res) => {
    User.deleteMany({}, () => {
        UserStats.deleteMany({}, () => {
            Puzzle.deleteMany({}, () => {
                UserGameSession.deleteMany({}, () => {
                    PuzzleStats.deleteMany({}, () => {
                        res.send("DELETED ALL")
                    })
                })
            })
        })
    })
})

module.exports = app;