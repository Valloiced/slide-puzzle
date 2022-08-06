import React, { useEffect } from 'react';
import axios from 'axios';
import Img from '../temp-holder.jpg';
import '../styles/front-page.css';

export default function Frontpage({ toggle }){

    useEffect(() => {
        axios.get('/data/status')
          .then(res => {
            let { isGuest, isLogin } = res.data

            if( !isGuest && !isLogin ) {
                window.location.href = "/guest"
            } else if (isLogin || isGuest) {
                window.location.href = "/explore"
            }
            
          })
        }, [0])

    return (
        <div className="container">

            <div className="intro--wrapper">
                <h1>Slide Puzzle Game</h1>
                <img src={Img} alt="placeholder"></img>  

                <div className="button--wrapper">
                    <a 
                        className="guest--button" 
                        href="/guest"
                    >
                        Play as Guest
                    </a>

                    <a 
                        className="auth--button"
                        onClick={ toggle }
                    >
                        Login/Sign-Up
                    </a>
                </div>
            </div>
        </div>
    )
}