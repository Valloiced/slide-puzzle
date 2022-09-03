import React from 'react';
import axios from 'axios';
import Puzzle from "../../../../global/assets/puzzle.png"
import Time   from "../../../../global/assets/time.png"
import Trash  from "../../../../global/assets/trash.png"
import User   from "../../../../global/assets/user.png"
import Play   from "../../../../global/assets/play-color.png"
import storeGameSession from "../../../../global/helpers/storeGameSession";
import '../../styles/create-puzzle.css'
import '../../styles/userpuzzle-card.css'

export default function DisplayPuzzles({ user, session, puzzleName, image, gameSize, timeTaken, puzzles, setPuzzles }) {
    let cardImageBg = {
        background: `url(${image})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '30vh',
        borderRadius: '20px 20px 10px 10px'
    }


    let handleRedirect = () => {
        axios.post(`/game/continue/${session}`)
            .then(res => {
                if(res.data.redirect){
                    storeGameSession(res.data.session)
                    window.location.href = "/game"
                }
            })
    }

    let handleDelete = () => {
        axios.delete(`/your-puzzles/user/${user.userId}/delete?s_id=${session}`)
            .then(res => {
                if(res.data.deleted){
                    let deleted = res.data.deletedPuzzle
                    let newPuzzles = puzzles.filter((p) => p.sessionId != deleted._id)

                    setPuzzles(newPuzzles)
                }
            })
    }

    let hours = Math.floor(timeTaken / 3600)

    let minutes = timeTaken / 3600 > 0 
        ? Math.floor((timeTaken % 3600) / 60)
        : Math.floor(timeTaken / 60)

    let seconds = timeTaken / 60 > 0 
        ? timeTaken % 60
        : timeTaken

    let reformat = (time) => {
        return time >= 10 ? time : "0" + time
    }

    return (
        <div className='displaypuzzle--card'>

            <div className="card--image" onClick={handleRedirect}>
                <div style={cardImageBg} className="image" >
                    <div className="play--button">
                        <img src={Play}></img>
                    </div>
                </div>
            </div>

            <div className={`card--info ${"s" + gameSize}`}>

                <div className="row">               
                    <h2 className="puzzle--name">{puzzleName}</h2>

                    <img className="icon" src={Trash} onClick={handleDelete}></img>
                </div>

                <div className="row">
                    <div className="game--info">
                        <div className="game--size">
                            <img className="icon" src={Puzzle}></img>
                            <p>{`${gameSize}x${gameSize}`}</p>
                        </div>

                        <div className="time--taken">
                            <img className="icon" src={Time}></img>
                            <p>{reformat(hours)}:{reformat(minutes)}:{reformat(seconds)}</p>
                        </div>
                    </div>

                    <div className="creator">
                        <img className="icon" src={User}></img>
                        <p>{user.username}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}