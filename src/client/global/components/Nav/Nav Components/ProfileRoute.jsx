import React from 'react'
import '../nav-styles.css'

export default function ProfileRoute({ username, profileImage }) {

    return (
        <div className='profileRoute'>
            <a href="/your-puzzles">Your Puzzles</a>
            {/* <img src={profileImage}></img> */}
            <h2>{username}</h2>
            {/* Add a settings as a feature */}
        </div>
    )
}