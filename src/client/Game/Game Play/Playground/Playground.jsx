import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import '../styles/playground.css';
// import UpdaterForTimerIguess
// import TheGameLogicBabbyyyy

class Tile {
    constructor(tile, x, y){
        this.x = x,
        this.y = y,
        this.tile = tile
    }
}

// TODO: Complete Logic Here
export default function Playground({ image, gameSize, timeTaken, pattern }){
    
    let canvasRef = useRef(null);
    let boardRef = useRef(null)

    let [ tiles, setTiles ] = useState([])
    let [ globalCtx, setGlobalCtx ] = useState()
    let [ globalBoardCtx, setGlobalBoardCtx ] = useState()
    let [ globalDimension, setGlobalDimension ] = useState()

    let generate = (ctx) => {
        let tempTiles = []
        for(let x = 0; x < gameSize; x++){
            for(let y = 0; y < gameSize; y++){
                let dataImage = ctx.getImageData(
                    dimension * x, dimension * y,
                    dimension, dimension
                )

                tempTiles.push(new Tile(dataImage, dimension * x, dimension * y))
                console.log(tiles)
            }
        }
    }

    let render = () => {
        for(let i = 0; i < tiles.length; i++){
            for(let j = 0; j < tiles[i].length; j++){
                let tileImg = tiles[i][j].tile
                let tile = tiles[i][j]

                tile.x = dimension * j
                tile.y = dimension * i 

                ctx.putImageData(tileImg, dimension * j, dimension * i)
            }
        }
    } 

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const board = boardRef.current
        const boardCtx = board.getContext('2d')

        let dimension = 600 // Max Width but this could change
        let margin = 5 
        let row = dimension / gameSize - margin
        let column = dimension / gameSize - margin

        canvas.width = 
        canvas.height = 
        board.width =
        board.height = dimension
 
        let img = new Image()
        img.src = image
        img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)   
            // generate(ctx)
            let tempTiles = []
            dimension = dimension / gameSize - margin
            for(let x = 0; x < gameSize; x++){
                for(let y = 0; y < gameSize; y++){
                    let dataImage = ctx.getImageData(
                        dimension * x, dimension * y,
                        dimension, dimension
                    )
    
                    console.log(dataImage)
                    tempTiles.push(new Tile(dataImage, dimension * x, dimension * y))
                    console.log(tiles)
                }
            }
            setGlobalCtx(ctx)
            setGlobalBoardCtx(boardCtx)
            setGlobalDimension(dimension / gameSize - margin)
        })

    }, [image])

    // useEffect(() => {
    // }, [globalBoardCtx])

    return (
        <div className='playground'>
            <h2>Timer: </h2>
            <canvas ref={canvasRef} style={{display: "none"}} />
            <canvas ref={boardRef} style={{backgroundColor: "blue"}} />
            <button className="reshuffle">Reshuffle Button</button>
        </div>
    )
}