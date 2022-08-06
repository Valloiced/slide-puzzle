import React from 'react'
import Play  from '../../../global/assets/play-color.png'
import User  from '../../../global/assets/user.png'
import Calendar from '../../../global/assets/calendar.png'
import '../../styles/puzzle-card.css'

export default function DisplayPuzzles({ creator, puzzleId, puzzleName, image, numOfPlayersPlayed, addedOn }) {
    //PARSING DATE
    addedOn = new Date(addedOn).toLocaleString().replace(/,.*/g, "")

    let cardImageBg = {
        background: `url(${image})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '30vh',
        borderRadius: '20px 20px 10px 10px'
    }

    let handleRedirect = () => {
        window.location.href = `/explore?pid=${puzzleId}`
    }

    return (
        <div className='displaypuzzle--card'>

            <div className="card--image" onClick={handleRedirect}>
                <div style={cardImageBg} className="image" >
                    <div className="play--button">
                        <img src={Play} />
                    </div>
                </div>
            </div>

            <div className="card--info">

                <div className="row">               
                    <h2 className="puzzle--name">{puzzleName}</h2>
                </div>

                <div className='sub--info'>
                    <div className="creator">
                        <img className="icon" src={User}></img>
                        <p>{creator}</p>
                    </div>

                    <div className="times--played">
                        <div className="play"></div>
                        <p>{numOfPlayersPlayed}</p>
                    </div>


                    <div className="date--added">
                        <img className="icon" src={Calendar}></img>
                        <p>{addedOn}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}