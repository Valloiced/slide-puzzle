const router = require('express').Router()
const { bindToSession, generatePattern } = require('../libs/handlerUtils')

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
    
    try {
        let newGameSession = new UserGameSession({
            userID: userId,
            puzzleID: pid,
            gameSize: gameSize,
            pattern: generatePattern(gameSize),
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

        let save = bindToSession({ direct_to_puzzle: null, in_game: session._id}, req)

        if(save){
            return res.json({
                isAllow: true,
                session: session // Save this to the localStorage in the client-side
            })
        }

        res.json({isAllow: false})
    }
    catch(e) {
        res.send(e)
    }


}, (req, res) => {
    const { gameSize, pid } = req.body  

    // I just need the session Id
    let newGuestSession = new UserGameSession({
        isGuest: true,
        puzzleID: pid,
        gameSize: gameSize,
        pattern: generatePattern(gameSize),
        timeTaken: 0,
        isFinished: false
    })

    
    let save = bindToSession({ direct_to_puzzle: null, in_game: newGuestSession._id }, req)
    console.log(newGuestSession)

    if(save){
        return res.json({
            isAllow: true,
            session: newGuestSession // Save this to the localStorage in the client-side
        })
    }


})

router.get('/play?', async (req, res) => {
    const { get_data, id } = req.query

    if(get_data == "session"){
        const sessionId = req.session.in_game
        return res.send(sessionId)

    } else if(get_data == "puzzle"){
        const puzzleId = id

        try {
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
        catch(e){
            console.log(e)
            req.send(e)
        }
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

router.put('/save-session', async (req, res) => {
    const { sessionID, newPattern, newTime } = req.body

    try {
        if(!sessionID){
            throw new Error("No session Id provided")
        }
    
        let session = await UserGameSession.findById(sessionID)
    
        if(!session){
            throw new Error("No session found");
        }
    
        if(session.pattern == newPattern || session.timeTaken == newTime){
            return res.send("No changes found")
        }
    
        session.pattern = newPattern
        session.timeTaken = newTime
        session.lastSession = Date.now()
    
        await session.save()
    
        res.json({ saved: true });
    }
    catch(e) {
        console.log(e)
        res.json({ saved: false })
    }
})

router.post('/validate', (req, res) => {
    res.send("Bitch")
})

module.exports = router;