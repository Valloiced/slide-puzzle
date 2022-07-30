const express  = require('express');
const path     = require('path');

const db       = require('../models/models');
const { User, Puzzle, UserGameSession, PuzzleStats } = db.collections

const app = express()

app.get('/getUser', (req, res) => {

    if(!req.user){ throw new Error("You are not authenticated!")}

    let { username, id, profileImg } = req.user
    
    res.json({
        user: { 
            userId: id,
            username: username, 
            profileImage: profileImg || null
    }})
})

app.get('/your-puzzles', (req, res) => {
    res.sendFile(path.join(process.cwd(), "/dist/userPuzzles.html"))
})

//TODO (done)
//Reformat next time to be applicable for sorting
app.get('/your-puzzles/user/:userId', (req, res) => {
    let { userId } = req.params

    UserGameSession.find({ userID: userId }, (err, doc) => {
        if(err) { return res.status(403).send(err)}
        if(!doc) { return res.status(404).send("404 No User Found")}
        let imageReference = []
        let displayOnly = []

        for(let i = 0; i < doc.length; i++){
            let curr = doc[i]
            imageReference.push(curr.puzzleID)
            displayOnly.push({ 
                puzzleID: curr.puzzleID,
                gameSize: curr.gameSize,
                timeTaken: curr.timeTaken,
                isFavorite: curr.isFavorite,
                isFinished: curr.isFinished,
                lastSession: curr.lastSession 
            })
        }

        Puzzle.find({ _id: [...imageReference ]}, (err, puzzle) => {
            if(err) { res.status(504).send(err)}

            let response = []

            for(let i = 0; i < puzzle.length; i++){
                let revertImg = Buffer.from(puzzle[i].image).toString('ascii');
                response.push({
                    ...displayOnly[i],
                    image: revertImg,
                    puzzleName: puzzle[i].puzzleName
                })
            }

            res.json({puzzles: response})
        })
    })
})

// TODO (90%)
// Just polish the error handler
app.post('/your-puzzles/user/:userId/create', (req, res) => {
    let { userId } = req.params
    let { username, image, puzzleName, gameSize, description } = req.body

    let newPuzzle = new Puzzle({
        puzzleName: puzzleName,
        image: image,
        description: description,
        addedBy: { userID: userId, username: username},
    })

    let newGameSession = new UserGameSession({
        userID: userId,
        puzzleID: newPuzzle._id,
        gameSize: gameSize,
        pattern: [],
        timeTaken: 0,
        isFavorite: false,
        isFinished: false
    })

    let newPuzzleStats = new PuzzleStats({
        puzzleID: newPuzzle._id,
        numOfPlayersPlayed: 0,
        numOfPlayersFinished: 0,
        leaderboardID: null
    })

    newPuzzle.puzzleStatsID = newPuzzleStats._id

    try {
        // Callback hell, baby!
        newPuzzle.save((err, puzzleDoc) => {
            if ( err ) { throw new Error(err) }
            console.log("Puzzle Created")

            newPuzzleStats.save((err, puzzleStatsDoc) => {
                if ( err ) { throw new Error(err) }
                console.log("Puzzle Stats Created")

                newGameSession.save((err, sessionDoc) => {
                    if ( err ) { throw new Error(err) }
                    console.log("Game Session Created")

                    let revertImg = Buffer.from(puzzleDoc.image).toString('ascii');
                    let response = {
                        ...puzzleDoc,
                        image: revertImg,
                        gameSize: sessionDoc.gameSize,
                        pattern: sessionDoc.pattern,
                        timeTaken: sessionDoc.timeTaken,
                        isFinished: sessionDoc.isFinished
                    }

                    res.json({ newGame: response })
                })
            })
        })
    } catch (e) {
        console.log(e)
        res.json({err: e})
    }
})

// let revertImg = Buffer.from(puzzleDoc.image).toString('ascii');
// let response = {
//     puzzleId: puzzleDoc._id,
//     image: revertImg,
//     gameSize: sessionDoc.gameSize,
//     pattern: sessionDoc.pattern
// }

module.exports = app



