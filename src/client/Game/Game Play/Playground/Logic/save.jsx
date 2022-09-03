import axios from 'axios';

export function localAutoSave( sessionID, pattern, timeTaken ) {
    if(!pattern || pattern.length == 0){
        return
    }

    let session = JSON.parse(localStorage.getItem('game-session'))
    
    session.map((s, i) => {
        if(s._id == sessionID){
            let save = {...s, pattern: pattern, timeTaken: timeTaken}
            
            session[i] = save
            localStorage.setItem('game-session', JSON.stringify([...session]))
        }
    })
    
}

export function serverSave(sessionID, currPattern, currTime) {
    if(currTime % 6 !== 0){
        return
    }
    
    let requestBody = {
        sessionID: sessionID,
        newPattern: currPattern,
        newTime: currTime
    }

    axios.put('/game/save-session', requestBody)
    .catch(e => {
        console.log(e)
    })
}

