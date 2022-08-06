import React from 'react';
import axios from 'axios';
import Puzzle from "../../../../global/assets/puzzle.png"
import Time   from "../../../../global/assets/time.png"
import Trash  from "../../../../global/assets/trash.png"
import User   from "../../../../global/assets/user.png"
import Play   from "../../../../global/assets/play-color.png"
import storeGameSession from "../../../../global/helpers/storeGameSession";
import '../../styles/userpuzzle-card.css'

export default function DisplayPuzzles({ creator, session, puzzleName, image, gameSize, timeTaken, isFinished }) {
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
        // window.location.href = "/game"
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

            <div className="card--info">

                <div className="row">               
                    <h2 className="puzzle--name">{puzzleName}</h2>

                    <img className="icon" src={Trash}></img>
                </div>

                <div className="row">
                    <div className="game--info">
                        <div className="game--size">
                            <img className="icon" src={Puzzle}></img>
                            <p>{`${gameSize}x${gameSize}`}</p>
                        </div>

                        <div className="time--taken">
                            <img className="icon" src={Time}></img>
                            <p>{timeTaken}</p>
                        </div>
                    </div>

                    <div className="creator">
                        <img className="icon" src={User}></img>
                        <p>{creator}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}