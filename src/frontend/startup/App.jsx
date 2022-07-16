import React, {useState} from 'react';
import FrontPage from './FrontPage/Frontpage';
import Auth from './Authentication/Auth';

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
