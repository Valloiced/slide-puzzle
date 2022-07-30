import React from 'react';

//TODO make this global
//This is not a custom hook, btw
export default function useHandleChange(data, setData){
    let { name, value } = data.target

    setData(prev => {
        return {
            ...prev,
            [name]: value
        }
    })
}