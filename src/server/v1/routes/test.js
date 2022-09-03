const app      =  require('express')();

const { uploadImage } = require('../libs/googleUtils');
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

const fs = require('fs');
const path = require('path')

let placebo = path.join(process.cwd(), 'src/client/global/assets/time.png')

app.get('/test-google', async (req, res) => {
    let testr = await uploadImage([
        { 
            high: placebo
        },
        { 
            medium: placebo
        },
        { 
            low: placebo
        },
    ],
    {
        name: 'Shessh',
        mimeType: 'image/png',
        description: 'ahhh'
    }
    )

    console.log(testr)
    res.send(testr)
})

module.exports = app;