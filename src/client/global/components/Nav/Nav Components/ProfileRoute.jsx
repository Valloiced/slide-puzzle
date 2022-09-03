import React from 'react'
import '../nav-styles.css'

export default function ProfileRoute({ username, profileImage }) {

    return (
        <div className='profileRoute'>
            <a className="nav-items" href="/your-puzzles">Your Puzzles</a>

            <div className="user--settings">
                {profileImage && <img className="pfimage" src={profileImage}></img>}         
                <a className="username" href="/profile">{username}</a>
            </div>
            {/* Add a settings as a feature */}
        </div>
    )
}