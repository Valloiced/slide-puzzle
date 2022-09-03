export default function checkWin(pattern, setGame) {
    if(!pattern || pattern.length == 0){
        return 
    }

    let temp = [...pattern]
    let compare = [...pattern].sort((a, b) => a > b ? 1 : -1)

    for(let i = 0; i < compare.length; i++){
        if(pattern[i] != compare[i]){
            setGame(false)
            return 
        }
    }

    setGame(true)
}