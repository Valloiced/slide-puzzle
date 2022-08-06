import React, {useState} from 'react'
import axios from 'axios'
import useHandleChange from '../Hooks/customHook'

export default function Login({ toggle }){
    let [ login, setLogin] = useState({
        username: "",
        password: ""
    })

    let loggingIn = (e) => {
        e.preventDefault(e)

        axios.post('/login', login)
            .then(res => {
                console.log(res)
                res.data.isAllow 
                ? window.location.href = "/explore"
                : console.log("false")
            })
    }

    return (
        <div className="authentication">
            <h1>Login</h1>

            <form 
                onSubmit={ loggingIn }
                className="auth--form"
            >
                <label>Username:</label>
                <input 
                    type="text" 
                    name="username"
                    value={login.username}
                    onChange={(e) => useHandleChange(e, setLogin)}
                />

                <label>Password:</label>
                <input 
                    type="password" 
                    name="password"
                    value={login.password}
                    onChange={(e) => useHandleChange(e, setLogin)}
                />
                <button>Login</button>
                <p 
                    className='switcher'
                    onClick={toggle}
                >
                Sign-up instead?
                </p>
            </form>
        </div>
    )
}