import React from 'react';

export default function useHandleChange(data, setData){
    let { name, value } = data.target

    setData(prev => {
        return {
            ...prev,
            [name]: value
        }
    })
}