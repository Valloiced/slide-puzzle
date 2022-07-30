import React from 'react'
import play  from '../../assets/play.png'
import user  from '../../assets/user.png'
import calendar from '../../assets/calendar.png'
import '../../styles/puzzleCard.css'

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
                </div>

                <div className='sub--info'>
                    <div className="creator">
                        <img className="icon" src={user}></img>
                        <p>{creator}</p>
                    </div>

                    <div className="times--played">
                        <div className="play"></div>
                        <p>{numOfPlayersPlayed}</p>
                    </div>


                    <div className="date--added">
                        <img className="icon" src={calendar}></img>
                        <p>{addedOn}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}