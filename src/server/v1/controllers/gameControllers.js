const router = require('express').Router()
const { bindToSession } = require('../libs/handlerUtils')

const db     = require('../models/models')
const { Puzzle, PuzzleStats, UserGameSession} = db.collections

router.get('/options', async (req, res) => {
    const pid = req.session.direct_to_puzzle || req.query.pid

    if(!pid) { 
        return res.json({ isAllow: false }) 
    }

    try {
        let puzzle = await Puzzle.findById(pid)
        let p_stats = await PuzzleStats.findById(puzzle.puzzleStatsID)

        if(!puzzle || !p_stats){
            return res.json({ isAllow: false})
        }

        let revertImg = Buffer.from(puzzle.image).toString('ascii');

        return res.json({ 
            isAllow: true, 
            puzzle_data: {
                ...puzzle._doc, 
                ...p_stats._doc,
                image: revertImg
            }
        })
    }
    catch(e) {
        res.send(e)
    }
})

// TODO: change the error handler since error and null are not the same
// Seperate shuffle to other file
router.post('/create', async (req, res, next) => {
    const { gameSize, pid, p_statsID } = req.body
    const { isGuest, isLogin }         = req.session
    const userId                       = req.query.u

    /**
     * If there's no userId embedded or if its a guest,
     * then redirect to next route that doesn't save user session
    */ 
    if( (isGuest && !isLogin) || !userId ) { 
        return next()
    } 
    
    let pattern = []
    let boardSize = gameSize * gameSize

    for(let i = 0; i < boardSize; i++ ){
        pattern.push(i)
    }

    /* Fisher-Yates Shuffle */
    let currentIndex = boardSize

    while(currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [pattern[currentIndex], pattern[randomIndex]] 
    = [pattern[randomIndex], pattern[currentIndex]];
    }
    
    try {
        let newGameSession = new UserGameSession({
            userID: userId,
            puzzleID: pid,
            gameSize: gameSize,
            pattern: pattern,
            timeTaken: 0,
            isFavorite: false,
            isFinished: false
        })

        let session = await newGameSession.save()
        let p_stats = await PuzzleStats.findById(p_statsID)

        if(!session || !p_stats){
            throw new Error("Saving Unsuccessful")
        }

        p_stats.numOfPlayersPlayed++

        let p_statsSave = await p_stats.save()

        if(!p_statsSave){
            throw new Error("Saving Unsuccessful")
        }

        bindToSession({ direct_to_puzzle: null, in_game: session._id}, req)

        if(bindToSession){
            return res.json({
                isAllow: true,
                session: session // Save this to the localStorage in the client-side
            })
        }

        throw new Error("Saving Unsuccessful")
    }
    catch(e) {
        res.send(e)
    }
})

router.get('/play?', async (req, res) => {
    const { get_data, id } = req.query

    if(get_data == "session"){
        const sessionId = req.session.in_game
        return res.send(sessionId)

    } else if(get_data == "puzzle"){
        const puzzleId = id

        let puzzle = await Puzzle.findById(puzzleId)

        if(!puzzle){
            throw new Error("No Puzzle Found")
        }
        
        let revertImg = Buffer.from(puzzle.image).toString('ascii')
        return res.json({
            puzzle_data: {
            ...puzzle._doc, 
            image: revertImg
            }
        });
    }
})

router.post('/continue/:sessionId', (req, res) => {
    const { sessionId } = req.params
    
    UserGameSession.findById(sessionId, (err, session_doc) => {
        if(!session_doc){
            return res.json({ redirect: false })
        }
        
        req.session.in_game = sessionId
        res.json({ redirect: true, session: session_doc })
    })
})

module.exports = router;