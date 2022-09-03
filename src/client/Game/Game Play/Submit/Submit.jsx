import React from 'react'
import GuestDisplay from './Guest/Guest Display'
import UserDisplay from './User/User Display'
import '../styles/submit.css'
import '../../../global/styles/layout.css'

export default function Submit({ sessionID, isGuest, setGame }) {
    return (
        <div className='submit--container'>
            <div className="message--wrapper">
                {
                    isGuest
                    ? <GuestDisplay sessionID={sessionID} />
                    : <UserDisplay sessionID={sessionID} setGame={setGame} />
                }
            </div>
        </div>
    )
}