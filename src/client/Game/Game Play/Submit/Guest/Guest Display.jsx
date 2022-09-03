import React, { useState } from "react";
import Display from "./Components/Display";
import Login from "./Components/Login";
import Registration from "./Components/Register";

export default function GuestDisplay({ sessionID }) {

    let [ isAuth, setIsAuth ] = useState(false)
    let [ authMode, setAuthMode ] = useState(true) 
    //true: logging in
    //false: registering

    let toggleAuth = () => {
        setAuthMode(prev => !prev)
    }

    let setAuth = () => {
        setIsAuth(prev => !prev)
    }

    let goBack = () => {
        cleanUp()
        window.location.href = "/explore"
    }
    
    let goToUser = () => {
        cleanUp()
        window.location.href = "/your-puzzles"
    }

    let cleanUp = () => {
        let gameSessions = JSON.parse(localStorage.getItem('game-session'))

        gameSessions.map((s, i) => {
            if(s._id == sessionID){
                gameSessions.splice(i, 1)
                localStorage.setItem('game-session', JSON.stringify(gameSessions))
            }       
        })
    }

    return (
        <>
        {
            isAuth
            ? 
                <div>
                    <a className="back" onClick={setAuth}>Go Back</a>
                    {
                        authMode
                            ? <Login 
                                toggle={toggleAuth} 
                                goToUser={goToUser}
                            />
                            : <Registration 
                                toggle={toggleAuth} 
                                goToUser={goToUser}
                            />
                    }
                </div>


            :  <Display goBack={goBack} toggle={setAuth} />
        } 
        </>
    )
}