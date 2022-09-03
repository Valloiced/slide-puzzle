import React, { useEffect } from 'react';
import '../../styles/playground.css'

export default function Timecounter( {currentTime, updater, isPaused} ) {
    
    useEffect(() => {
        let timer = setInterval(() => {
            if(isPaused) { return }

            updater(prev => prev += 1)
        }, 1000)
        
        return () => {
            clearInterval(timer)
        }
        
    }, [ isPaused ])

    let hours = Math.floor(currentTime / 3600)

    let minutes = currentTime / 3600 > 0 
        ? Math.floor((currentTime % 3600) / 60)
        : Math.floor(currentTime / 60)

    let seconds = currentTime / 60 > 0 
        ? currentTime % 60
        : currentTime

    let reformat = (time) => {
        return time >= 10 ? time : "0" + time
    }
    
    return (
        <h2 className="time--counter">Time: {reformat(hours)}:{reformat(minutes)}:{reformat(seconds)}</h2>
    )
}