import React from 'react';
import Calendar from '../../../../global/assets/calendar.png';
import User from '../../../../global/assets/user.png';
import Puzzle from '../../../../global/assets/puzzle.png';
import '../../styles/image.css'

// TODO: Design
export default function ImageDetails({ name, description, addedBy, addedOn, gameSize }) {
    //PARSING DATE
    addedOn = new Date(addedOn).toLocaleString().replace(/,.*/g, "")

    return (
        <div className="image--details">
            <h1 className="puzzle--name">{name}</h1>
            {description != "" && <p className='description'>{description}</p>}

            <div className="sub">
                <div className="icon--wrapper">
                    <img className="icon" src={User} />
                    <p>{addedBy.username}</p>
                </div>
                <div className="icon--wrapper">
                    <img className="icon" src={Puzzle} />
                    <p>{gameSize}</p>
                </div>
                <div className="icon--wrapper">
                    <img className="icon" src={Calendar} />
                    <p>{addedOn}</p>                
                </div>
            </div>
        </div>
    )
}