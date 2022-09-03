import React from 'react';
import Play  from '../../../../../global/assets/play-color.png';
import User  from '../../../../../global/assets/user.png';
import { useSwiperSlide } from 'swiper/react';

export default function Puzzle({ puzzleId, puzzleName, image, addedBy, numOfPlayersPlayed }) {

    const swiperSlide = useSwiperSlide()

    let cardImageBg = {
        background: `url(${image})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '15vh',
        borderRadius: '20px 20px 10px 10px'
    }

    const handleRedirect = () => {
        window.location.href = `/explore?pid=${puzzleId}`
    }

    return (
        <div className='puzzle' onClick={handleRedirect}>
            <div className="card--image">
                <div style={cardImageBg} className="puzzle--image" >
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
                        <p>{addedBy.username}</p>
                    </div>

                    <div className="times--played">
                        <div className="play"></div>
                        <p>{numOfPlayersPlayed}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}



// export default function DisplayPuzzles({ creator, puzzleId, puzzleName, image, numOfPlayersPlayed, addedOn }) {
    

//     let handleRedirect = () => {
//         window.location.href = `/explore?pid=${puzzleId}`
//     }

//     return (
//         <div className='displaypuzzle--card'>

            
//         </div>
//     )
// }