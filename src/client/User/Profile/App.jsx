import React from 'react';
import Navbar from '../../global/components/Nav/Navbar'
import PlayerInfo from './PlayerInfo/PlayerInfo';
import '../../global/styles/layout.css'
import '../../global/styles/game--size.css'

export default function App() {
    return (
        <>
            <Navbar />
            <div className='main--body'>
                <PlayerInfo />
            </div>
        </>
    )
}