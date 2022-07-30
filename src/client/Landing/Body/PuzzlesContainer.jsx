import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DisplayPuzzles from './Components/DisplayPuzzles';
import '../styles/puzzleCard.css'

export default function PuzzlesContainer({ search = null }) {

    let [ puzzles, setPuzzles ] = useState([])

    let [ sortBy, setSortBy ] = useState("addedOn")

    useEffect(() => {
        axios.get(`/explore/puzzles?s=${sortBy}&${search && "q=" + search }`)
            .then(res => {
                setPuzzles(res.data.puzzles || [])
            })
    }, [])

    let displayPuzzles = puzzles.map(p => {
        return <DisplayPuzzles 
            key={p._id}
            creator={p.addedBy.username}
            puzzleId={p._id}
            puzzleName={p.puzzleName}
            image={p.image}
            addedOn={p.addedOn}
            numOfPlayersPlayed={p.numOfPlayersPlayed}
        />
    })

    return (
        <div className='content--body'>     
            <div className='puzzles--container'>{displayPuzzles}</div>
        </div>
    )
}