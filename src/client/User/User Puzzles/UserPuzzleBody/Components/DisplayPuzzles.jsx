import React from 'react';
import puzzle from "../../../assets/puzzle.png"
import time   from "../../../assets/time.png"
import trash  from "../../../assets/trash.png"
import user   from "../../../assets/user.png"
import play   from "../../../assets/play.png"
import '../../../styles/userPuzzles.css'

export default function DisplayPuzzles({ creator, puzzleId, puzzleName, image, gameSize, timeTaken, isFinished }) {
    let cardImageBg = {
        background: `url(${image})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '30vh',
        borderRadius: '20px 20px 10px 10px'
    }

    return (
        <div className='displaypuzzle--card'>

            <div className="card--image">
                <div style={cardImageBg} className="image" >
                    <div className="play--button">
                        <img src={play}></img>
                    </div>
                </div>
            </div>

            <div className="card--info">

                <div className="row">               
                    <h2 className="puzzle--name">{puzzleName}</h2>

                    <img className="icon" src={trash}></img>
                </div>

                <div className="row">
                    <div className="game--info">
                        <div className="game--size">
                            <img className="icon" src={puzzle}></img>
                            <p>{`${gameSize}x${gameSize}`}</p>
                        </div>

                        <div className="time--taken">
                            <img className="icon" src={time}></img>
                            <p>{timeTaken}</p>
                        </div>
                    </div>

                    <div className="creator">
                        <img className="icon" src={user}></img>
                        <p>{creator}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}