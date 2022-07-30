import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useHandleChange from "../customHook"
import '../../styles/userPuzzles.css';

export default function CreatePuzzle({ user, toggle }) {

    let [image, setImage] = useState()
    let [resizedImg, setResizedImg] = useState()
    let [error, setError] = useState(false)
    let [ options, setOptions ] = useState({
        puzzleName: "MyPuzzle",
        gameSize: 3,
        description: ""
    })

    let canvasRef = useRef(null)

    let draw = (ctx, canvas) => {  
        if(image){
            let img = new Image()
            img.src = image
            img.addEventListener('load', () => {
                canvas.width = 300;
                canvas.height = 300;
                ctx.drawImage(img,  0, 0, canvas.width, canvas.height);

                let newImage = canvas.toDataURL()
                setResizedImg(newImage)
            })
        }
    }
    
    let getImageData = (e) => {
        let image = e.target.files[0]
        let base64
        
        //TODO
        if(!(/image/g).test(image.type)){
            setError(true)
            return
        }
        setError(false)

        let reader = new FileReader();
        reader.onloadend = () => {
            base64 = reader.result
            setImage(base64)
        }
        reader.readAsDataURL(image);
    }

    let handleSubmit = (e) => {
        e.preventDefault()
        if(!error) {
            let requestBody = {
                username: user.username,
                image: resizedImg, 
                ...options
            }
            
            // TODO (the error handler and the game route)
            axios.post(`/your-puzzles/user/${user.userId}/create`, requestBody)
            .then(res => {
                // if(res.data.err) { setError(true) }
                // sessionStorage.setItem('game-session', res.data.newGame )
                // window.location.href = "/puzzles/play"
                window.location.href = "/your-puzzles"
            })
        }
    } 

    useEffect(() => {
        let canvas = canvasRef.current
        let context = canvas.getContext('2d')

        draw(context, canvas)
    }, [image])

    return (
        <div className="create--container">
            <a onClick={() => toggle(false)}>X Cancel</a>

            <h1>Your Image: </h1>
            <canvas ref={ canvasRef } className="image--container" />
            <h2 className='name--showcase'>{options.puzzleName}</h2>

            <form onSubmit={handleSubmit}>

                <div className="flexed">
                    <div className="imagereader--wrapper">
                        <label htmlFor='imageReader'>Add Image Here:</label>
                        <input required
                            className="image--reader"
                            type="file"
                            name="imageReader"
                            onChange={getImageData}
                        />

                    </div>
                        <div className="puzzlenameinput--wrapper">
                            <label htmlFor='puzzleName'>Puzzle Name:</label>
                            <input required
                                className="puzzlename--input"
                                type="text"
                                name="puzzleName"
                                maxLength="50"
                                placeholder="E.g Moon, Your Mom"
                                value={options.puzzleName}
                                onChange={(e) => useHandleChange(e, setOptions)}
                            />    
                    </div>

                </div>

                <label htmlFor='gameSize'>Puzzle Size/Difficulty:</label>
                <select required
                    name="gameSize"
                    value={options.gameSize}
                    onChange={(e) => useHandleChange(e, setOptions)}
                >
                    <option value={2}>2x2 Mediocore</option>
                    <option value={3}>3x3 Easy</option>
                    <option value={4}>4x4 Kinda Easy</option>
                    <option value={5}>5x5 Medium</option>
                    <option value={6}>6x6 Somehow Medium</option>
                    <option value={7}>7x7 Hard</option>
                    <option value={8}>8x8 Very Hard</option>
                    <option value={9}>9x9 Difficult</option>
                    <option value={10}>10x10 HOLY SHIT!</option>
                </select>

                <label htmlFor='description'>Description: (optional)</label>
                <textarea 
                    className='description--input'
                    name="description"
                    placeholder="Optional"
                    value={options.description}
                    onChange={(e) => useHandleChange(e, setOptions)}
                />

                <button>Create New Game Session</button>
            </form>
        </div>
    )
}