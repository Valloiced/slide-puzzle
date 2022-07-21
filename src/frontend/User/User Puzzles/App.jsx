import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../../Global Components/Nav/Navbar';

export default function App() {

    let [ puzzles, setPuzzles ] = useState([])


    //TODO
    useEffect(() => {
        let getUser = async () => {
            let res = await axios.get("/getUser")

            axios.get(`/puzzles/${res.data.user.userId}`)
                .then(res => console.log(res.data.puzzles))
        }

        getUser()

    }, [0])

    return (
        <>
            <Navbar />
        </>
    )
}