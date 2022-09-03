import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import Default from "../../../../../global/assets/user.png"
import Edit from "../../../../../global/assets/edit.png"

export default function ProfileImage({ pfImg, userId, joinedOn, setPfImage }) {

    let  [ image, setImage ] = useState(null)
    let [ resizedImg, setResizedImg ] = useState(null)
    let [ isEdit, setIsEdit ] = useState(false)

    let canvasRef = useRef(null)
    
    useEffect(() => {
        if(image){ 
            let canvas = canvasRef.current
            let ctx = canvas.getContext('2d')

            let img = new Image()
            img.src = image
            img.addEventListener('load', () => {
                canvas.width = 128;
                canvas.height = 128;
                ctx.drawImage(img,  0, 0, canvas.width, canvas.height);

                let newImage = canvas.toDataURL()
                setResizedImg(newImage)
                return 
            })
        }

        if(resizedImg){
            axios.put(`/profile/${userId}?edit=pf-img`, {img: resizedImg})
                .then(res => {
                    setPfImage(res.data.newImg)
                })
                .catch(e =>{
                    console.log("Sheeesh")
                })
        }
    }, [ image, resizedImg ])


    let getImageData = (e) => {
        let image = e.target.files[0]
        let base64
        
        //TODO
        // if(!(/image/g).test(image.type)){
        //     setError(true)
        //     return
        // }
        // setError(false)

        let reader = new FileReader();
        reader.onloadend = () => {
            base64 = reader.result
            setImage(base64)
        }
        reader.readAsDataURL(image);
    }

    //PARSING DATE
    joinedOn = new Date(joinedOn).toLocaleString().replace(/,.*/g, "")

    let imageBg = {
        backgroundImage: `url(${pfImg ? pfImg : Default})`,
        backgroundSize: '100% 100%',
        width: '100%',
        height: '15vh'
    }

    return (
        <div className="profileimage--wrapper">

            <div className="image--section">
                <div className="image" alt={"name"} style={imageBg}></div>
                <img className="edit" src={Edit} onClick={() => setIsEdit(prev => !prev)} />

                {
                    isEdit 
                    &&
                    <input required
                        type="file" 
                        onChange={getImageData}
                    />        
                }

                <canvas style={{opacity: "0", position: "absolute"}} ref={canvasRef} ></canvas>
            </div>

            <div className="joinedOn">
                <p>Joined On</p>
                <h2>{joinedOn}</h2>              
            </div>
        </div>
    )
}