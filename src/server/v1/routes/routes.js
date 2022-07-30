const app      =  require('express')()
const path     = require('path');
const db       = require('../models/models');
const { User, Puzzle, PuzzleStats} = db.collections

app.get('/explore', (req, res) => {
    res.sendFile(path.join(process.cwd() + "/dist/landing.html"))
})

app.get('/explore/puzzles?', (req, res) => {
    let query = req.query.q || "." // Default to all
    let sort  = req.query.s || "puzzleName" // Default to sort by puzzle name
    let limit = req.query.lim || 10

    console.log(req.query)
   if(sort == "any") { sort = "puzzleName"}

    let rgx = new RegExp(query);
    let option = { $regex: rgx, $options: 'gi'}

    console.log(option)
    Puzzle.find({
    $or: [
        {"puzzleName": option}, 
        {"description": option},
        {"addedBy.username": option} 
    ]}) 
    .sort({[sort]: -1})
    .limit(limit)
    .select({ description: 0 })
    .exec((err, puzzle) => {
        let puzzleStatsIDs = puzzle.map(p => p.puzzleStatsID) 

        PuzzleStats.find({ _id: [...puzzleStatsIDs] }, (err, stats) => {

            let response = []

            for(let i = 0; i < stats.length; i++){

                let revertImg = Buffer.from(puzzle[i].image).toString('ascii');
       
                response.push({
                    ...puzzle[i]._doc, 
                    image: revertImg,
                    numOfPlayersPlayed: stats[i].numOfPlayersPlayed
                })
            }

            res.json({puzzles: response})
        })
    })
})

    
    // let sort = "puzzleName"
    // let query = "b"

    // Puzzle.find({})
    // .sort({puzzleName: 1})
    // .limit(2)
    // .select({ description: 0, image: 0 })
    // .exec((err, puzzle) => {
    //     let pz = []

    //     puzzle.map(p => {
    //         if((/a/gi).test(p.puzzleName)){
    //             pz.push(p)
    //         }
    //     })

    //     res.send(pz)
    // })

module.exports = app;