import React from 'react';
import Image from './Components/Image';
import ImageDetails from './Components/Image Details'
import '../styles/image.css'

export default function ImageContainer({ puzzleName, description, addedBy, addedOn, image, gameSize }) {

    return (
        <div className={`image--container ${"s" + gameSize}`}>
            <Image 
                image={image} 
            />
            
            <ImageDetails 
                name={puzzleName} 
                description={description}
                addedBy={addedBy}
                addedOn={addedOn}
                gameSize={gameSize}
            />
        </div>
    )
} 