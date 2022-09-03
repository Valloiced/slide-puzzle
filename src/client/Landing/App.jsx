import React from 'react';
import Navbar from '../global/components/Nav/Navbar'
import PuzzlesContainer from './Puzzles Container/Puzzles Container';
import './styles/puzzle-card.css'

export default function App(){
    return (      
        <>
            <Navbar />
            <div className='content--body'>  
                <PuzzlesContainer />   
            </div>
        </>
    )
}