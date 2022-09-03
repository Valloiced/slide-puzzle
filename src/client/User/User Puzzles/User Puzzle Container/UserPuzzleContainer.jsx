import React, { useEffect, useState } from 'react';
import axios from "axios";
import DisplayPuzzles from './Components/DisplayPuzzles';
import '../styles/userpuzzle-card.css'

export default function UserPuzzleBody({ user, toggle }) {

    let [ puzzles, setPuzzles ] = useState([])

    useEffect(() => {
        if(user.username == ""){ return }

        axios.get(`/your-puzzles/user/${user.userId}`)
            .then(res => {
                setPuzzles(res.data.puzzles || [])
            })
    }, [user])

    let displayPuzzles = puzzles.map(p => {
        return <DisplayPuzzles
                    key={p.sessionId}
                    user={user}
                    session={p.sessionId}
                    puzzleName={p.puzzleName}
                    image={p.image}
                    gameSize={p.gameSize}
                    timeTaken={p.timeTaken}
                    puzzles={puzzles}
                    setPuzzles={setPuzzles}
                />
    })

    return (
        <>
            <h1 className='header'>Your Recent Puzzles: </h1>

            <div className='puzzles--container'>{displayPuzzles}</div>

            <button 
                className='create--button'
                onClick={() => toggle(true)}
            >
                Create New Puzzle
            </button>
        </>
    )
}

