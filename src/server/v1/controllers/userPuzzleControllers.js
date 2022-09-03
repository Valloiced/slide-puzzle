const router = require('express').Router()
const db     = require('../models/models')
const { UserStats, UserGameSession, Puzzle, PuzzleStats, PuzzleLeaderboard } = db.collections
const { bindToSession } = require('../libs/handlerUtils')
const { generatePattern } = require('../libs/gameUtils')

//TODO (done)
//Reformat next time to be applicable for sorting
router.get('/user/:userId', async (req, res) => {
    let { userId } = req.params

    try {
        let session = await UserGameSession.find({ userID: userId, isFinished: false })
        if(!session){
            throw new Error("There's no game session found for the user")
        }

        let imageReferenceIds = []
        let displayData = []

        for(let i = 0; i < session.length; i++){
            let curr = session[i]

            imageReferenceIds.push(curr.puzzleID)
            displayData.push({ 
                sessionId: curr.id,
                puzzleID: curr.puzzleID,
                gameSize: curr.gameSize,
                timeTaken: curr.timeTaken,
                isFinished: curr.isFinished,
                lastSession: curr.lastSession 
            })
        }

        let puzzle = await Puzzle.find({ _id: [...imageReferenceIds]})

        if(!puzzle){
            throw new Error("No puzzle found for the sessions")
        }
        
        let response = []
            
        /** 
         * In case for duplicate puzzle ids (Due to identical game sessions), the database will 
         * only sends one image because all sessions are referenced to only that one image.
         * Other than looping through the puzzle_doc, which would cause for incompletion,
         * I choose to use it as a reference for reusability
         * 
         * - Note for myself, so I wouldn't forgor
        */ 
        const puzzlesId = puzzle.map(p => p.id)
        
        for(let i = 0; i < displayData.length; i++){
            let referencedIndex = puzzlesId.indexOf(String(imageReferenceIds[i]))
            let referencedPuzzle = puzzle[referencedIndex]
            let revertImg = Buffer.from(referencedPuzzle.image).toString('ascii')
        
            response.push({
                ...displayData[i],
                image: revertImg,
                puzzleName: referencedPuzzle.puzzleName
            })
        }

        res.json({puzzles: response})
    }

    catch(e) {
        res.send(e)
    }
})

router.post('/user/:userId/create', async (req, res) => {
    let { userId } = req.params
    let { username, image, puzzleName, gameSize, description } = req.body
    let { UserStatsID } = req.user
    
    try {
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
            pattern: generatePattern(gameSize),
            timeTaken: 0,
            isFinished: false
        })
    
        let newPuzzleStats = new PuzzleStats({
            puzzleID: newPuzzle._id,
            numOfPlayersPlayed: 1,
            numOfPlayersFinished: 0,
        })

        let newPuzzleLeaderboard = new PuzzleLeaderboard({
            puzzleID: newPuzzle._id,
            gameSize: {
                "2x2": [],
                "3x3": [],
                "4x4": [],
                "5x5": [],
                "6x6": [],
                "7x7": [],
                "8x8": [],
                "9x9": [],
                "10x10": []
            }
        })
    
        newPuzzle.puzzleStatsID = newPuzzleStats._id
        newPuzzleStats.leaderboardID = newPuzzleLeaderboard._id

        let puzzle  = await newPuzzle.save()
        let p_stats = await newPuzzleStats.save()
        let p_leaderboard = await newPuzzleLeaderboard.save()
        let session = await newGameSession.save()
    
        if(!puzzle || !p_stats || !session || !p_leaderboard){
            throw new Error("Saving Unsuccessful")
        }

        let u_stats = await UserStats.findById(UserStatsID)
        
        u_stats.numOfPuzzlesCreated++

        await u_stats.save()
    
        bindToSession({ in_game: session._id }, req)
        res.json({ newGame: session })
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/user/:userID/delete?', async (req, res) => {
    const { userID } = req.params
    const { s_id } = req.query

    try {
        const deleted = await UserGameSession.findOneAndDelete({ userID: userID, _id: s_id })
    
        if(!deleted) {
            throw new Error("Failed to delete session.")
        }
    
        res.json({ deleted: true, deletedPuzzle: deleted })
    }
    catch(e) {
        console.log(e)
        res.status(400).json({ deleted: false })
    }
})

module.exports = router