import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from './Components/Profile';
import ProfileImage from './Components/ProfileImage';

export default function ProfileContainer({ user, setUser }) {

    let [ info, setInfo ] = useState({
        skillPoint: 0,
        bestTime: 0, 
        numOfPuzzlesSolved: 0, 
        numOfPuzzlesCreated: 0,
        totalFavorites: 0,
        numOfPiecesFinishedByGameSizes: 0,
        bestTimeByGameSizes: 0
    })

    useEffect(() => {
        if(user.u_statsId == "") { return }

        axios.get(`/profile/${user.u_statsId}/data?get=user`)
            .then(res => {
                setInfo(res.data.user_info)
            })

    }, [user])

    let updateImage = (img) => {
        setUser(prev => {
            return {
                ...prev,
                profileImage: img
            }
        })
    }

    return (
        <div className="profile--container">
            <ProfileImage 
                pfImg={user.profileImage}
                userId={user.userId}
                joinedOn={user.joinedOn}
                setPfImage={updateImage}
            />

            <Profile 
                {...info}
                joinedOn={user.joinedOn}
                username={user.username}
            />
        </div>
    )
}