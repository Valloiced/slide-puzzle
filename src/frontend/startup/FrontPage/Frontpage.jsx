import React, { useEffect } from 'react';
import axios from 'axios';
import '../../styles/front-page.css';
import Img from '../temp-holder.jpg';

export default function FrontPage({ toggle }){

    useEffect(() => {
        axios.get('/check')
          .then(res => {
            res.data.isGuest 
                ? window.location.href = "/guest"
                : res.data.isLogin 
                ? window.location.href = "/explore"
                : false
          })
        }, [])

    return (
        <div className="container">

            <div className="intro--wrapper">
                <h1>Slide Puzzle Game</h1>
                <img src={Img} alt="placeholder"></img>  

                <div className="button--wrapper">
                    <a 
                    className="guest--button" 
                    href="/guest">
                        Play as Guest
                    </a>

                    <a 
                    className="auth--button"
                    onClick={ toggle }>
                        Login/Sign-Up
                    </a>
                </div>
            </div>
        </div>
    )
}