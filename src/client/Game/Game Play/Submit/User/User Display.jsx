import React from "react";
import axios from 'axios'

export default function UserDisplay({ sessionID, setGame }) {

    let handleSubmitAndCleanUp = () => {
        let gameSessions = JSON.parse(localStorage.getItem('game-session'))

        let session = gameSessions.map((s, i) => {
            if(s._id == sessionID){
                axios.put('/game/validate', s)
                    .then(res => {
                        if(res.data.success){
                            console.log("We did it!")
                            gameSessions.splice(i, 1)
                            localStorage.setItem('game-session', JSON.stringify(gameSessions))
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        })
    }

    return (
        <div className="user--display">
            <h1>Nicely Done!</h1>

            <p>Do you want to submit your session?</p>

            <div className="submit--buttons">
           
                <button onClick={() => setGame(false)}>Nah, let me observe first</button>
                <button onClick={handleSubmitAndCleanUp}>Yes please</button>
            </div>
        </div>
    )
}