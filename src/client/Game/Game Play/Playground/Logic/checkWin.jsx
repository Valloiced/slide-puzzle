import { set } from "mongoose"

export default function checkWin(pattern, setGame) {
    if(!pattern || pattern.length == 0){
        return 
    }

    let temp = [...pattern]
    let compare = temp.sort()

    for(let i = 0; i < compare.length; i++){
        if(pattern[i] != compare[i]){
            return 
        }
    }

    setGame(true)
}