const router = require('express').Router()
const db     = require('../models/models')
const { UserGameSession, Puzzle, PuzzleStats } = db.collections
const { bindToSession, generatePattern } = require('../libs/handlerUtils')

//TODO (done)
//Reformat next time to be applicable for sorting
router.get('/user/:userId', async (req, res) => {
    let { userId } = req.params

    try {
        let session = await UserGameSession.find({ userID: userId })
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
                isFavorite: curr.isFavorite,
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

// TODO (90%)
// Just polish the error handler
router.post('/user/:userId/create', async (req, res) => {
    let { userId } = req.params
    let { username, image, puzzleName, gameSize, description } = req.body

    
    try {
        let newPuzzle = new Puzzle({
            puzzleName: puzzleName,
            image: image,
            description: description,
            addedBy: { userID: userId, username: username},
        })
    
        //Change this, puzzle must be the one who had the favorite not session
        let newGameSession = new UserGameSession({
            userID: userId,
            puzzleID: newPuzzle._id,
            gameSize: gameSize,
            pattern: generatePattern(gameSize),
            timeTaken: 0,
            isFavorite: false,
            isFinished: false
        })
    
        let newPuzzleStats = new PuzzleStats({
            puzzleID: newPuzzle._id,
            numOfPlayersPlayed: 1,
            numOfPlayersFinished: 0,
            leaderboardID: null
        })
    
        newPuzzle.puzzleStatsID = newPuzzleStats._id

        let puzzle  = await newPuzzle.save()
        let p_stats = await newPuzzleStats.save()
        let session = await newGameSession.save()
    
        if(!puzzle || !p_stats || !session){
            throw new Error("Saving Unsuccessful")
        }
    
        let revertImg = Buffer.from(puzzle.image).toString('ascii');
        let response = {
            ...puzzle,
            image: revertImg,
            sessionId: session.id,
            gameSize: session.gameSize,
            pattern: session.pattern,
            timeTaken: session.timeTaken,
            isFinished: session.isFinished
        }
    
        bindToSession({ in_game: session._id }, req)
        res.json({ newGame: session })
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router