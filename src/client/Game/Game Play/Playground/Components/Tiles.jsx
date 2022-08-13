import React, { useEffect, useRef } from 'react'
import '../../styles/playground.css'

function Tiles({ i, index, img, x, y, size, setClickedTile }, ref) {

    let tileRef = useRef(null)

    useEffect(() => {
        const tileCanvas = tileRef.current
        const tileCtx = tileCanvas.getContext('2d')
        
        tileCanvas.width = size
        tileCanvas.height = size
        
        tileCtx.putImageData(img, 0, 0)

        ref.current[i] = tileRef.current
    }, [img])

    
    useEffect(() => {
        tileRef.current.addEventListener('click', () => {
            setClickedTile(index)
        })
        
        // return () => {
        //     tileRef.current.removeEventListener('click', true)
        // }
    }, [tileRef])

    let styleLogic = {
        position: "absolute",
        opacity: index == 0 ? "0" : "1",
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition: 'transform 300ms ease-in'
    }
    
    return (
        <canvas ref={tileRef} className="tiles" style={styleLogic} />
    )
}

export default React.forwardRef(Tiles);