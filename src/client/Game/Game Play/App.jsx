import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../global/components/Nav/Navbar'
import ImageContainer from './Image/Image Container'
import Playground from './Playground/Playground';
import "./styles/main.css"

export default function App() {
  
  let [ isGuest, setIsGuest ] = useState(false)
  let [ session, setSession ] = useState(false);
  let [ puzzleData, setPuzzleData ] = useState(false)

  let [ isFinished, setIsFinished ] = useState(false)

  //Get session data
  useEffect(() => {
    if(session) { return }

    axios.get('/game/play?get_data=session')
        .then(res => {
            let sessions = JSON.parse(localStorage.getItem('game-session'))

            sessions.forEach(s => {
              if(s._id == res.data){
                if(s.isGuest ) { setIsGuest(true) }
                setSession(s)
                return 
              }
            })
        })
  }, [])

  // Get puzzle data
  useEffect(() => {
    if(!session) { return }

      axios.get(`/game/play?get_data=puzzle&id=${session.puzzleID}`)
        .then(res => {
            if(res.data){
              setPuzzleData(res.data.puzzle_data)
            }
        })
  }, [session])

  let background = {
    position: 'absolute',
    width: '100%',
    backgroundImage: `url(${puzzleData.image})`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `cover`,
    backgroundAttachment: `fixed`,
    backgroundPosition: `center`
  }

  return (
    <div style={background}>
      <Navbar />

      <div className="content--body" style={{backgroundColor: 'rgba(255,255,255,0.7)'}}>
        { 
        session && puzzleData       
          ?
            <>
              <ImageContainer 
                puzzleID={puzzleData.puzzleID} 
                puzzleName={puzzleData.puzzleName} 
                description={puzzleData.description}
                addedOn={puzzleData.addedOn} 
                addedBy={puzzleData.addedBy}
                image={puzzleData.image}
                gameSize={session.gameSize}
              />
              <Playground 
                isGuest={isGuest}
                sessionID={session._id}
                image={puzzleData.image}
                gameSize={session.gameSize}
                timeTaken={session.timeTaken}
                pattern={session.pattern}
                isFinished={isFinished}
                setGame={setIsFinished}
              />
            </>
           
            : <h1>Loading Game....</h1>
      }
       </div>
    </div>
  )
}
