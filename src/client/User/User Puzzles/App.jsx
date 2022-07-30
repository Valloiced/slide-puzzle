import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Global Components/Nav/Navbar';
import UserPuzzleBody from './UserPuzzleBody/UserPuzzleBody';
import CreatePuzzle from './Create Puzzle/CreatePuzzle';

export default function App() {

    let [ user, setUser ] = useState({
        userId: "",
        username: ""
    })

    let [ isCreate, setIsCreate ] = useState(false)

    useEffect(() => {
        axios.get('/getUser')
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