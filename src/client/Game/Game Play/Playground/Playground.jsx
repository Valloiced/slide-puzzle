import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios'
import generate from './Logic/generate';
import gameController from './Logic/controller';
import { localAutoSave, serverSave } from './Logic/save';
import winChecker from './Logic/checkWin';
import Timecounter from './Components/Time Counter';
import '../styles/playground.css';

export default function Playground({ isGuest, sessionID, image, gameSize, timeTaken, pattern, isFinished, setGame }){
    
    let canvasRef = useRef(null);
    let tilesContainerRef = useRef(null)

    let currTilesRef = useRef([]);
    let [ currTiles, setCurrTiles] = useState([])
    let [ currPattern, setCurrPattern ] = useState([])

    let [ currTilePos, setCurrTilePos ] = useState(0)

    let [ currTime, setCurrTime ] = useState(0)

    /** Setup the puzzle board */
    useLayoutEffect(() => {     
        setCurrPattern(pattern)
        setCurrTime(timeTaken)
        
        generate(
            canvasRef, 
            tilesContainerRef, 
            currTilesRef,
            image, 
            pattern, 
            gameSize,
            setCurrTiles,
            setCurrTilePos
        )
        
    }, [image])

    /** Controller Logic */
    useEffect(() => {
        let formattedPattern = formatTo2d(currPattern, gameSize)

        const options = {
            pattern: formattedPattern,
            currTile: {
                index: currTilePos, 
                canvas: currTilesRef.current[currTilePos]  
            },
            blankTile: currTilesRef.current[0],
            gameSize: gameSize,
            setters: {
                setCurrPattern,                                
                setCurrTilePos
            }
        }

        gameController(options)

    }, [currTilePos])

    /** Auto Save */
    useEffect(() => {
        if(!isGuest){ 
            serverSave(sessionID, currPattern, currTime)
        }

        localAutoSave(sessionID, currPattern, currTime)
     
    }, [currPattern, currTime])
    
    useEffect(() => {
        if(isFinished && !isGuest){
            axios.post('/game/validate', {
                sessionID: sessionID,
                pattern: currPattern,
                timeTaken: currTime
            })
            .then(res => {
                console.log(res)
                setGame(false)
            })
        }
    
        winChecker(currPattern, setGame)    
    }, [currPattern])

    
    let shuffle = () => {
        let tempPattern = [...currPattern]
        let currentIndex = gameSize * gameSize

        while(currentIndex != 0){
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [tempPattern[currentIndex], tempPattern[randomIndex]] 
        = [tempPattern[randomIndex], tempPattern[currentIndex]];
        }

        setCurrTiles([])
        setCurrPattern(tempPattern)
        currTilesRef.current = []

        generate(
            canvasRef, 
            tilesContainerRef, 
            currTilesRef,
            image, 
            tempPattern, 
            gameSize,
            setCurrTiles,
            setCurrTilePos
        )
    }

    return (
        <div className='playground'>

            {!isFinished && <Timecounter currentTime={currTime} updater={setCurrTime} />}
            <canvas ref={canvasRef} className="hidden--canvas" />

            <div className="border">
                <div className="tiles--container" ref={tilesContainerRef}>
                    {currTiles}
                </div>
            </div>
            <button className="reshuffle" onClick={shuffle}>Reshuffle Button</button>
        </div>
    )
}

/** Helpers */

// function createBlankImage(ctx, dimensions){
//     let blankTile = ctx.createImageData(dimensions, dimensions)
//         for(let i = 0; i < blankTile.data.length; i++){
//             blankTile.data[i] = 255
//     }
//     return blankTile
// }

function formatTo2d(pattern, gameSize){
    let newFormat = []

    for(let i = 0; i < pattern.length; i += gameSize){
        let part = pattern.slice(i, i + gameSize)
        newFormat.push(part)
    }

    return newFormat
}
