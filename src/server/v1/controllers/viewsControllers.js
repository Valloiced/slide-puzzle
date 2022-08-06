const router = require('express').Router();
const path   = require('path');

const { ensureAuthenticated, bindToSession } = require('../libs/handlerUtils')

const ROOT_DIRECTORY = process.cwd()

/** Startup*/
router.get('/', (req, res) => {
    res.sendFile(path.join(ROOT_DIRECTORY + "/dist/startup.html"));
})

/** Explore/Landing */
router.get('/explore', (req, res) => {  
    //Redirect to the options view since user choose a puzzle
    if(req.query.pid) { 
        return res.redirect(`/options?pid=${req.query.pid}`) 
    }

    res.sendFile(path.join(ROOT_DIRECTORY, "/dist/landing.html"))

})

/** Options */
router.get('/options', ( req, res ) => {
    const { pid } = req.query

    // Setting data for the next route since I cant send data and html file at the same time :(
    bindToSession({ direct_to_puzzle: pid}, req)
    res.sendFile(path.join(ROOT_DIRECTORY, "/dist/gameOptions.html"))
})

/** Profile*/
// router.get('/home', (req, res) => {

// })

/** User Puzzles*/
router.get('/your-puzzles', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(ROOT_DIRECTORY, "/dist/userPuzzles.html"))
})

/** Game */
router.get('/game', (req, res) => {
    res.sendFile(path.join(ROOT_DIRECTORY, "/dist/game.html"))
})

module.exports = router;