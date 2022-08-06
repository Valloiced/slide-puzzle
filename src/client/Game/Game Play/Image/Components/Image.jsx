import React from 'react';
import '../../styles/image.css'

export default function Image({ image }) {
    
    let imageBg = {
        backgroundImage: `url(${image})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '65vh'
    }

    return (
        <>
            <div className="image" style={imageBg}></div>
        </>
    )
}