import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthRoute from './Nav Components/AuthRoute';
import ProfileRoute from './Nav Components/ProfileRoute';
import './nav-styles.css';

export default function Navbar({ setSearchOptions = null }) {

    let [ isLogin, setIsLogin ] = useState(false)
    
    let [ user, setUser ] = useState({
        username: "Guest",
        profileImage: ""
    })

    useEffect(() => {
        axios.get('/check')
            .then(res => {
                if(res.data.isLogin){

                    setIsLogin(res.data.isLogin)
                    axios.get('/getUser')
                        .then(res => setUser(res.data.user))

                }
            })
        
        
    }, [0])
    
    return (
        <header>
            <div className="navbar">
                <p className="Logo">Logo</p> {/** Place logo here */}


                { setSearchOptions != null && <h1>bitch</h1>} 

                <div className="routes">
                    <a href='/explore'>Explore</a>
                    { isLogin 
                        ? <ProfileRoute 
                            username={user.username} 
                            profileImage={user.profileImage}
                            />
                        : <AuthRoute />
                    }
                </div>
            </div>
        </header>
    )
}