import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from './Profile/ProfileContainer';
import Puzzles from './Puzzles/PuzzleContainer';
import '../styles/playerinfo.css'

export default function PlayerInfo() {

    let [ user, setUser ] = useState({
        userId: "",
        username: "",
        u_statsId: "",
        profileImage: "",
        joinedOn: 0
    })

    useEffect(() => {
        axios.get('/data/get_user')
            .then(res => {
                setUser(res.data.user)
            })
    }, [])

    return (
        <div className="info--container">
            <h2>Player Info:</h2>

            <div className="line--h" />

            <div className="info--wrapper">
                <Profile 
                    user={user}
                    setUser={setUser}
                />
                <Puzzles 
                    user={user}
                />
            </div>
        </div>
    )
}