const router = require('express').Router();
const db = require("../models/models");
const { User, UserStats, Puzzle, PuzzleStats, Favorites } = db.collections 

router.get('/:u_statsId/data?', async (req, res) => {
    const { u_statsId } = req.params
    const { get } = req.query

    try {
        if(get == "" || !get){
            throw new Error("Please specify what data to retrieve")
        }

        let u_stats = await UserStats.findById(u_statsId)

        if(!u_stats){ 
            throw new Error("No User Stats Found");
        }

        switch(get){
            case "user":      
                
                const favorites = await Favorites.findById(u_stats.favoritesID)

                if(!favorites){
                    return res.json({ err: "Favorites Found" });
                }

                if(req.session.playTime > u_stats.playTime){
                    u_stats.playTime = req.session.playTime

                    u_stats = await u_stats.save()
                }

                const response = {
                    ...u_stats._doc,
                    totalFavorites: favorites.numOfFavorites
                }

                return res.json({user_info: response})

            case "created-puzzles":
                let puzzles = await Puzzle.find({"addedBy.userID": u_stats.userID})

                if(!puzzles){
                    return res.json({ err: "No Puzzles Found" });
                }

                let puzzleStatsIDs = puzzles.map(p => p.puzzleStatsID)

                const p_stats = await PuzzleStats.find({ _id: [...puzzleStatsIDs] })
                const statsIds = p_stats.map(s => s.id)

                let createdPuzzles = []

                for(let i = 0; i < p_stats.length; i++){
                    
                    let referencedIndex = statsIds.indexOf(String(puzzleStatsIDs[i]))
                    let referencedStats = p_stats[referencedIndex];
                    let revertImg = Buffer.from(puzzles[i].image).toString('ascii');
                    
                    createdPuzzles.push({
                        ...puzzles[i]._doc, 
                        image: revertImg,
                        numOfPlayersPlayed: referencedStats.numOfPlayersPlayed
                    })
                }

                return res.json({ createdPuzzles: createdPuzzles })
        }
    }
    catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.put('/:userId?', async (req, res) => {
    const { userId } = req.params
    const { edit } = req.query
    const { img } = req.body

    try {
        if(edit == "pf-img"){
            let user = await User.findById(userId)
    
            if(!user) {
                throw new Error("User doesn't exist")
            }
    
            user.profileImg = img
    
            let saveUser = await user.save()
            
            if(!saveUser){
                throw new Error("Failed to update profile image")
            }

            let revertImg = Buffer.from(user.profileImg).toString('ascii');

            req.user.profileImg = revertImg
            return res.json({ newImg: revertImg})
        }
    }
    catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router