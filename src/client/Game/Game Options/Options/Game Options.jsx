import React, { useState } from 'react';
import axios from 'axios';
import useHandleChange from '../../../global/helpers/handleChange';
import storeGameSession from '../../../global/helpers/storeGameSession'
import '../styles/option.css';

//TODO: Leaderboard and design
export default function GameOptions({ puzzleId, puzzleStatsId, userId }){

    // To scale for the features next time
    let [ options, setOptions ] = useState({
        gameSize: "2"
    })


    let handleSubmit = (e) => {
        e.preventDefault();

        let request_body = {
            ...options, 
            pid: puzzleId, 
            p_statsID: puzzleStatsId 
        }

        axios.post(`/game/create?u=${userId}`, request_body)
            .then(res => {
                if(!res.data.isAllow || !res.data.session){
                    return // Error login here pleaseeeeeee
                }

                storeGameSession(res.data.session)

                window.location.href = "/game"
            })
    }

    return (
        <div className="game--option">
            <h1>Game Options: </h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor='gameSize'>Puzzle Size/Difficulty:</label>
                    <select required
                        name="gameSize"
                        value={options.gameSize}
                        onChange={(e) => useHandleChange(e, setOptions)}
                    >
                        <option value={2}>2x2 Mediocore</option>
                        <option value={3}>3x3 Easy</option>
                        <option value={4}>4x4 Kinda Easy</option>
                        <option value={5}>5x5 Medium</option>
                        <option value={6}>6x6 Somehow Medium</option>
                        <option value={7}>7x7 Hard</option>
                        <option value={8}>8x8 Very Hard</option>
                        <option value={9}>9x9 Difficult</option>
                        <option value={10}>10x10 HOLY SHIT!</option>
                    </select>

                    <button>Create Game Session</button>
            </form>
        </div>
    )
}