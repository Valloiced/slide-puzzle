import React, { useState } from 'react';
import FrontPage from './Frontpage/Frontpage';
import Auth from '../global/components/Authentication/Auth';

export default function App(){

    let [ isAuth, setIsAuth ] = useState(false);  

    let toggle = () => {
        setIsAuth(prev => !prev)
    }

    return (
        <>   
            {
                isAuth 
                ? <Auth toggle={toggle} /> 
                : <FrontPage toggle={toggle} />
            }
        </>
    )
}
