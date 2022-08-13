let ensureAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    return next()
}

/** To remove the guest attribute if the user logins or add it if */
let guestHandler = (req, res, next) => {
    if( req.session.guest || req.user ) {
        req.session.guest = false
        return next()
    } 

    req.session.guest = true
    return next()
}

let bindToSession = (items, requestBody) => {
    if(typeof items != Object && !requestBody){
        return false
    }

    let itemKey = Object.keys(items)
    let itemValues = Object.values(items)

    for(let i = 0; i < itemKey.length; i++){
        requestBody.session[itemKey[i]] = itemValues[i]
    }

    return true
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

module.exports = { ensureAuthenticated, guestHandler, bindToSession, generatePattern }