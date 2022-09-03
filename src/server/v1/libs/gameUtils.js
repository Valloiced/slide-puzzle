let calculateScore = (gameSize, timeTaken, modMultiplier = 0) => {
    const size = gameSize * gameSize
    const timeCalculate = timeTaken * 0.01
    const multiplier = size * modMultiplier

    const score = size * Math.pow(0.95, timeCalculate) + multiplier

    return score
}

let generatePattern = (gameSize) => {
    let pattern = []
    let boardSize = gameSize * gameSize

    for(let i = 0; i < boardSize; i++ ){
        pattern.push(i)
    }

    /* Fisher-Yates Shuffle */
    let currentIndex = boardSize

    while(currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [pattern[currentIndex], pattern[randomIndex]] 
    = [pattern[randomIndex], pattern[currentIndex]];
    }

    return pattern
}

module.exports = { generatePattern, calculateScore }