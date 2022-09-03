import React from 'react';

export default function Display({ goBack, toggle }) {
    return (
        <div className="guest--display">
                <h1>Brilliant!</h1>

                <div className="message">
                    <p>You can submit your score if you are login.</p>
                    <p>Do you wanna <span>register/login</span>?</p>       
                </div>
                <p className="warning">Warning: Once authenticated, game progress here wouldn't be saved</p>

                <div className="submit--buttons">
                    <button onClick={goBack}>Nah, Take me back</button>
                    <button onClick={toggle}>Login/Register</button>
                </div>
        </div>
    )
}