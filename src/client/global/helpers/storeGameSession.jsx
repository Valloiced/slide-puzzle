export default function storeGameSession(session){
    let game_session_store = localStorage.getItem('game-session');
    
    if(!game_session_store || game_session_store == ""){
        localStorage.setItem('game-session', JSON.stringify([session]));
        return 
    }
    
    game_session_store = JSON.parse(game_session_store)
    
    game_session_store.map(s => {
        if(s.id == session.id) { return }
    })
    
    let newGame = [ ...game_session_store, session]
    localStorage.setItem('game-session', JSON.stringify(newGame))   
    return 
}