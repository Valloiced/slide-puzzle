import React, {useState} from 'react'
import axios from 'axios'
import useHandleChange from '../../../../../global/helpers/handleChange'

export default function Registration({ toggle, goToUser }){
    let [ registration, setRegistration] = useState({
        username: "",
        password: ""
    })

    let register = (e) => {
        e.preventDefault(e)

        axios.post('/register', registration)
            .then(res => {
                if(res.data.isAllow){
                    goToUser()
                }
            })
    }

    
    return (
        <div className="authentication">
            <h1>Registration</h1>

            <form 
                onSubmit={ register }
                className="auth--form"
            >
                <label>Username:</label>
                <input 
                    type="text" 
                    name="username"
                    value={registration.username}
                    onChange={(e) => useHandleChange(e, setRegistration)}
                />

                <label>Password:</label>
                <input 
                    type="password" 
                    name="password"
                    value={registration.password}
                    onChange={(e) => useHandleChange(e, setRegistration)}
                />
                <button>Register</button>
                <p 
                    className='switcher'
                    onClick={toggle}
                >
                Login instead?
                </p>
            </form>
        </div>
    )
}