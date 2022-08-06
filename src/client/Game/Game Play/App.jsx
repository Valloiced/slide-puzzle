import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../global/components/Nav/Navbar'
import ImageContainer from './Image/Image Container'
import Playground from './Playground/Playground';
import "./styles/main.css"

export default function App() {

  let [ user, setUser ] = useState({
    userId: "",
    username: ""
  });
  
  let [ session, setSession ] = useState("");

  let [ puzzleData, setPuzzleData ] = useState({
      puzzleID: "",
      puzzleName: "",
      description: "",
      addedBy: "",
      addedOn: "",
      image: ""
  });
  
  // Get user data
  // Reformat to be applicable for guest players
  useEffect(() => {
    axios.get('/data/get_user')
        .then(res => {
            setUser(res.data.user)
        })
  }, [])

  // Get session data
  useEffect(() => {
    axios.get('/game/play?get_data=session')
        .then(res => {
          if(res.data){

            let sessions = JSON.parse(localStorage.getItem('game-session'))

            sessions.forEach(s => {
              if(s._id == res.data){
                setSession(s)
              }
            })

          }
        })
  }, [user])

  // Get puzzle data
  useEffect(() => {
    if(session != ""){
      axios.get(`/game/play?get_data=puzzle&id=${session.puzzleID}`)
        .then(res => {
            if(res.data){
              setPuzzleData(res.data.puzzle_data)
            }
        })
    }
  }, [session])


  return (
    <>
      <Navbar />
      <div className="content--body">
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
          image={puzzleData.image}
          gameSize={session.gameSize}
          timeTaken={session.timeTaken}
          pattern={puzzleData.pattern}
        />
      </div>
    </>
  )
}
