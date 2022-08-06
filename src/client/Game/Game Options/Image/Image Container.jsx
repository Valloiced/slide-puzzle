import React from 'react';
import Image from './Components/Image';
import ImageDetails from './Components/Image Details'
import '../styles/image.css'

export default function ImageContainer({ name, description, addedBy, addedOn, image, numOfPlayersFinished, numOfPlayersPlayed }) {

    return (
        <div className="image--container">
            <Image 
                image={image} 
            />
            
            <ImageDetails 
                name={name} 
                description={description}
                addedBy={addedBy}
                addedOn={addedOn}
                numOfPlayersFinished={numOfPlayersFinished}
                numOfPlayersPlayed={numOfPlayersPlayed}
            />
        </div>
    )
} 