import React, { useState, useEffect } from 'react';
import User from '../../../../../global/assets/user.png'
import '../../../styles/playerinfo.css'

export default function Profile({ username, skillPoint, bestTime, numOfPuzzlesSolved, numOfPuzzlesCreated, totalFavorites, numOfPiecesFinishedByGameSizes, bestTimeByGameSizes, joinedOn, playTime = 0 }) {
    
    let [ puzzleStats, setPuzzleStats ] = useState(null)

    let days = Math.floor(playTime / (3600 * 24 * 1000))

    let hours = playTime / (24 * 3600 * 1000)
    ? Math.floor((playTime % (24 * 3600 * 1000)) / (3600 * 1000))
    : Math.floor(playTime / (24 * 3600 * 1000))

    let minutes = playTime / 3600 > 0 
        ? Math.floor((playTime % 3600) / 60)
        : Math.floor(playTime / 60)


    let totalPlaytime = `${days}d ${hours}h ${minutes}m`

    useEffect(() => {
        if(!numOfPiecesFinishedByGameSizes && !bestTimeByGameSizes) { return }

        let puzzleSolvedKeys = Object.keys(numOfPiecesFinishedByGameSizes)
        let bestTimeKeys = Object.keys(bestTimeByGameSizes)
    
        let puzzleStats = puzzleSolvedKeys.map((p, i) => {
            return <PuzzleStats 
                key={p}
                gameSize={i + 2}
                puzzlesSolved={numOfPiecesFinishedByGameSizes[p]}
                bestTime={bestTimeByGameSizes[bestTimeKeys[i]]}
            />
        })

        setPuzzleStats(puzzleStats)
    }, [numOfPiecesFinishedByGameSizes, bestTimeByGameSizes])

    return (
        <div className="profile">
            <div className="main--info">
                <div className="user">        
                    <img src={User} />
                    <h1 className='username'>{username}</h1>
                </div>

                <div className="skillpoint">
                    <p>SkillPoint</p>
                    <h2>{skillPoint.toFixed(2)}</h2>
                </div>
            </div>

            <span className="seperator--h" />

            <div className="profile--wrapper">
                <div className="user--stats">
                    <div className='left--stats'>
                        <div>
                            <h2>Total Playtime: </h2>
                            <h2>Total of Puzzles Added:</h2>
                        </div>

                        <div>
                            <h2>{totalPlaytime}</h2>
                            <h2>{numOfPuzzlesCreated}</h2>
                        </div>
                    </div>

                    <div className='right--stats'>
                        <div>
                            <h2>Total Favorites:</h2>
                        </div>
                        <div>
                            <h2> {totalFavorites}</h2>
                        </div>
                    </div>
                    
                </div>

                <ul className="puzzle--stats">
                    <li className="headers">
                        <p className="placeholder">s</p>
                        <p>Finished Puzzles</p>
                        <p>Best Time</p>
                    </li>
                    { puzzleStats }
                </ul>

                <div className="overall">
                    <h2>Total Finished Puzzles: {numOfPuzzlesSolved}</h2>
                    <h2>Overall Best Time: {reformat(bestTime)}</h2>
                </div>
            </div>
        </div>
    )
}

function PuzzleStats({ gameSize, puzzlesSolved, bestTime}) {
    return (
        <li className={`rankbox ${"s" + gameSize}`}>
            <p>{gameSize + "x" + gameSize}</p>
            <p>{puzzlesSolved ? puzzlesSolved : "No scores set yet"}</p>
            <p>{bestTime ? reformat(bestTime): "No scores set yet"}</p>
        </li>
    )
}

let reformat = (bestTime) => {
	let hours = Math.floor(bestTime / 3600)

    let minutes = bestTime / 3600 > 0 
        ? Math.floor((bestTime % 3600) / 60)
        : Math.floor(bestTime / 60)

    let seconds = bestTime / 60 > 0 
        ? bestTime % 60
        : bestTime

    let fix = (time) => {
        return time >= 10 ? time : "0" + time
    }
	
	return `${fix(hours)}:${fix(minutes)}:${fix(seconds)}`
}