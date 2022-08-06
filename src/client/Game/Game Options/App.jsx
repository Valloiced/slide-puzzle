import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../global/components/Nav/Navbar';
import ImageContainer from './Image/Image Container';
import GameOptions from './Options/Game Options';
import './styles/main.css';

export default function App() {

    let [ user, setUser ] = useState({
        userId: "",
        username: ""
    })

    let [ puzzleData, setPuzzleData ] = useState({
        puzzleID: "",
        puzzleName: "",
        puzzleStatsID: "",
        description: "",
        addedBy: {userID: '6', username: ''},
        addedOn: "",
        image: "",
        numOfPlayersFinished: 0,
        numOfPlayersPlayed: 0,
        leaderboardID: null,
    })

    useEffect(() => {
        axios.get('/game/options')
            .then(res => {
                res.data.isAllow 
                ? setPuzzleData(res.data.puzzle_data)
                : window.location.href = "/explore" // Go back
            })
    }, [user])

    useEffect(() => {
        // Reformat to be applicable for guest players
        axios.get('/data/get_user')
            .then(res => {
                setUser(res.data.user)
            })
    }, [])
    
    return (
        <>
            <Navbar />
            <div className="content--body">

                <ImageContainer 
                    name={puzzleData.puzzleName}
                    description={puzzleData.description}
                    addedBy={puzzleData.addedBy}
                    addedOn={puzzleData.addedOn}
                    image={puzzleData.image}
                    numOfPlayersFinished={puzzleData.numOfPlayersFinished}
                    numOfPlayersPlayed={puzzleData.numOfPlayersPlayed}
                />

                <div className="container">
                    <GameOptions 
                        puzzleId={puzzleData.puzzleID} 
                        puzzleStatsId={puzzleData.puzzleStatsID}
                        userId={user.userId}
                    />
                </div>          
            </div>
        </>
    )
}