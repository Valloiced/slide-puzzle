import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthRoute from './Nav Components/AuthRoute';
import ProfileRoute from './Nav Components/ProfileRoute';
import './nav-styles.css';

export default function Navbar({ setSearchOptions = null, dataToSet }) {

    let [ isLogin, setIsLogin ] = useState(false)
    
    let [ user, setUser ] = useState({
        userId: "",
        username: "Guest",
        profileImage: ""
    })

    useEffect(() => {
        axios.get('/data/status')
            .then(res => {
                if(res.data.isLogin){

                    setIsLogin(res.data.isLogin)
                    // Reformat to be applicable for guest players
                    axios.get('/data/get_user')
                        .then(res => setUser(res.data.user))

                }
            })
        
        
    }, [0])
    
    return (
        <header>
            <nav className="navbar">
                <ul>
                    <li className="Logo">Slido</li> {/** Place logo here */}


                    <li className="searchbar">{ setSearchOptions != null && <h1>bitch</h1>}</li>

                    <li className="routes">
                        <a href='/explore'>Explore</a>
                        { isLogin 
                            ? <ProfileRoute 
                                username={user.username} 
                                profileImage={user.profileImage}
                              />
                            : <AuthRoute />
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}