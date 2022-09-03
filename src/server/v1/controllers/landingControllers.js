const router = require('express').Router()

const db     = require('../models/models')
const { Puzzle, PuzzleStats } = db.collections

router.get('/puzzles?', (req, res) => {
    let query = req.query.q || "." // Default to all
    let sort  = req.query.s || "puzzleName" // Default to sort by puzzle name
    let limit = req.query.lim || 20

    if(sort == "any") { sort = "puzzleName"}

    let rgx = new RegExp(query);
    let option = { $regex: rgx, $options: 'gi'}

    Puzzle.find({
    $or: [
        {"puzzleName": option}, 
        {"description": option},
        {"addedBy.username": option} 
    ]}) 
    .sort({[sort]: 1})
    .limit(limit)
    .select({ description: 0 })
    .exec((err, puzzle) => {
        let puzzleStatsIDs = puzzle.map(p => p.puzzleStatsID)

        PuzzleStats.find({ _id: [...puzzleStatsIDs] }, (err, stats) => {
            let response = []

            const statsIds = stats.map(s => s.id)
            for(let i = 0; i < stats.length; i++){
                
                let referencedIndex = statsIds.indexOf(String(puzzleStatsIDs[i]))
                let referencedStats = stats[referencedIndex];
                let revertImg = Buffer.from(puzzle[i].image).toString('ascii');
                
                response.push({
                    ...puzzle[i]._doc, 
                    image: revertImg,
                    numOfPlayersPlayed: referencedStats.numOfPlayersPlayed
                })
            }
            
            res.json({puzzles: response})
        })
    })
})

module.exports = router