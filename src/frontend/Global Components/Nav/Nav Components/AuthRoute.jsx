import React, {useState} from 'react';
import Auth from '../../Authentication/Auth';
import '../nav-styles.css'

export default function AuthRoute() {

    let [ isAuth, setIsAuth ] = useState(false);  

    let toggle = () => {
        setIsAuth(prev => !prev)
    }

    return (
        <div className='authRoute'>
            { isAuth 
                ? <Auth toggle={toggle} />
                : <p onClick={toggle}>Login/Signup</p>
            }
        </div>
    )
}