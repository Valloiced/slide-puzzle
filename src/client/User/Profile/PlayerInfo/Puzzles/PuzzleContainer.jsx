import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './Components/Carousel';
import "../../styles/puzzle.css";

export default function PuzzleContainer({ user }) {

    const [ puzzles, setPuzzles ] = useState([])

    useEffect(() => {
        if(user.u_statsId == "") { return }

        axios.get(`/profile/${user.u_statsId}/data?get=created-puzzles`)
            .then(res => {
                setPuzzles(res.data.createdPuzzles)
            })

    }, [user])

    return (
        <div className="puzzle--container">
            <h2>Your Puzzles:</h2>
            <div className="puzzle--wrapper">
                <Carousel puzzles={puzzles} />
            </div>
        </div>
    )
}

