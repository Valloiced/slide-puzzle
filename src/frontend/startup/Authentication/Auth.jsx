import React, {useState} from 'react';
import Registration from './AuthMode/Register';
import Login from './AuthMode/Login';
import '../styles/auth-page.css'

export default function Auth({ toggle }){

    let [ authMode, setAuthMode ] = useState(true) 
    //true: logging in
    //false: registering

    let toggleAuth = () => {
        setAuthMode(prev => !prev)
    }

    return (
        <div className="auth--container">
            <div className="showcase">
                <div className='interactive'>
                    {/* Add the puzzle logic here */} 
                </div>
            </div>
            
            <div className="auth--wrapper">
                <a className="back" onClick={toggle}>Go Back</a>

                {
                    authMode
                    ? <Login toggle={toggleAuth} />
                    : <Registration toggle={toggleAuth} />
                }
            </div>
        </div>
    )
}