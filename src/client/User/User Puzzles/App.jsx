import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../global/components/Nav/Navbar';
import UserPuzzleBody from './User Puzzle Container/UserPuzzleContainer';
import CreatePuzzle from './Create Puzzle/CreatePuzzle';
import "./styles/main.css"

export default function App() {

    let [ user, setUser ] = useState({
        userId: "",
        username: ""
    })

    let [ isCreate, setIsCreate ] = useState(false)

    useEffect(() => {
        // Reformat to be applicable for guest players
        axios.get('/data/get_user')
            .then(res => {
                setUser(res.data.user)
            })
    }, [])

    let toggleCreate = (option) => setIsCreate(option);

    return (
        <>
            <Navbar />
            <div className='content--body'>
                {
                    isCreate 
                        ? <CreatePuzzle user={user} toggle={toggleCreate} />
                        : <UserPuzzleBody user={user} toggle={toggleCreate} />
                }      
            </div>
        </>
    )
}