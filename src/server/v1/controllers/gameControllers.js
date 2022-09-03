const router = require('express').Router()
const { bindToSession, ensureAuthenticated } = require('../libs/handlerUtils')
const { calculateScore, generatePattern } = require('../libs/gameUtils')

const db = require('../models/models')
const { UserStats, Puzzle, PuzzleStats, UserGameSession, PuzzleLeaderboard} = db.collections

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

router.put('/save-session', ensureAuthenticated, async (req, res) => {
    const { sessionID, newPattern, newTime } = req.body
    
    try {
        if(!sessionID){
            throw new Error("No session Id provided")
        }

        let session = await UserGameSession.findById(sessionID)
    
        if(!session){
            throw new Error("No session found");
        }

        if(session.isFinished){
            throw new Error("Session already validated")
        }
    
        if(session.pattern == newPattern || session.timeTaken == newTime){
            return res.send("No changes found")
        }
        
        req.session.playTime += 6
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

router.put('/validate', ensureAuthenticated, async (req, res) => {
    const { _id, puzzleID, gameSize, pattern, timeTaken } = req.body
    const { username, UserStatsID } = req.user
    
    try {

        if(!puzzleID || !timeTaken || !pattern){
            throw new Error("Missing required fields")
        }
    
        let sortedPattern = [...pattern].sort((a, b) => a > b ? 1 : -1)
        for(let i = 0; i < sortedPattern.length; i++){
            if(pattern[i] != sortedPattern[i]){
                throw new Error("Pattern provided is unsorted or unavailable ")
                break
            }
        }

    
        /** Update Session */
        let session = await UserGameSession.findById(_id)
    
        if(!session){
            throw new Error("No session found")
        }
    
        session.pattern = pattern
        session.timeTaken = timeTaken
        session.isFinished = true
        session.lastSession = Date.now()
        
    
        const score = calculateScore(gameSize, timeTaken) // Mod Multiplier later
    
        let u_stats = await UserStats.findById(UserStatsID)

        let timeByGameSize = u_stats.bestTimeByGameSizes[`${gameSize}x${gameSize}`]
    
        if(u_stats.numOfPuzzlesSolved == 0){
            u_stats.bestTime = timeTaken
        } else {
            u_stats.bestTime = Math.min(u_stats.bestTime, timeTaken) 
        } 

        if(timeByGameSize == 0) {
            u_stats.bestTimeByGameSizes[`${gameSize}x${gameSize}`] = timeTaken
        } else {
            u_stats.bestTimeByGameSizes[`${gameSize}x${gameSize}`] = Math.min(timeByGameSize, timeTaken)
        }
         
        u_stats.numOfPiecesFinishedByGameSizes[`${gameSize}x${gameSize}`]++   
        u_stats.numOfPuzzlesSolved++  
        u_stats.skillPoint += score
        
    
        /** Update Puzzle Stats */
        let p_stats = await PuzzleStats.findOne({ puzzleID: puzzleID })
    
        p_stats.numOfPlayersFinished++
    
    
    
        /** Update Leaderboard */
        let p_leaderboard = await PuzzleLeaderboard.findById(p_stats.leaderboardID)
    
        let rankings = p_leaderboard.gameSize[`${gameSize}x${gameSize}`]
    
        for(let i = 0; i < rankings.length; i++){
            if(rankings[i].timeTaken <= timeTaken){
                const toAdd = {
                    rank: i + 1,
                    username: username,
                    skillPoint: score,
                    timeTaken: timeTaken,
                    // Add for mods later
                }
                rankings[i].splice(i + 1, 0, toAdd)
                session.ranking = i + 1
                break;
            }
        }
   
        p_leaderboard.gameSize[`${gameSize}x${gameSize}`] = rankings
    
        const savedSession = await session.save()
        const savedUserstats = await u_stats.save()
        const savedPuzzleStats = await p_stats.save()
        const savedPuzzleLeaderboard = await p_leaderboard.save()
    
        if(!savedSession || !savedUserstats || !savedPuzzleStats || !savedPuzzleLeaderboard) {
            throw new Error("Unable to save your session")
        }
    
        return res.json({ success: true })

    }
    catch(e) {
        console.log(e)
        return res.status(400).json({ success: false })
    }

})

module.exports = router;