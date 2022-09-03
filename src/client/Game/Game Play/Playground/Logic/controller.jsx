export default function controller({pattern, currTile, blankTile, gameSize, setters}){
    if(currTile.index == 0){
        return 
    }
    
    let [ currTilePosX, currTilePosY ] = getTile2dPos(currTile.index, pattern)
    
    let blankTileIndex = 0

    if(currTilePosX - 1 >= 0){
        if(pattern[currTilePosY][currTilePosX - 1] == blankTileIndex){
            
            swap2d(
                pattern, 
                [currTilePosY, currTilePosX],
                [currTilePosY, currTilePosX - 1]
                )
                
            let tempTile = blankTile.style.transform
            blankTile.style.transform = currTile.canvas.style.transform
            currTile.canvas.style.transform = tempTile
        }  
    }

    if(currTilePosX + 1 <= gameSize - 1){
        if(pattern[currTilePosY][currTilePosX + 1] == blankTileIndex){          

            swap2d(
                pattern, 
                [currTilePosY, currTilePosX],
                [currTilePosY, currTilePosX + 1]
                )
            
            let tempTile = blankTile.style.transform
            blankTile.style.transform = currTile.canvas.style.transform
            currTile.canvas.style.transform = tempTile
        }
    }

    if(currTilePosY - 1 >= 0){
        if(pattern[currTilePosY - 1][currTilePosX] == blankTileIndex){

            swap2d(
                pattern, 
                [currTilePosY, currTilePosX],
                [currTilePosY - 1, currTilePosX]
                )
        
            let tempTile = blankTile.style.transform
            blankTile.style.transform = currTile.canvas.style.transform
            currTile.canvas.style.transform = tempTile
        }               
    }

    if(currTilePosY + 1 <= gameSize - 1){
        if(pattern[currTilePosY + 1][currTilePosX] == blankTileIndex){

            swap2d(
                pattern, 
                [currTilePosY, currTilePosX],
                [currTilePosY + 1, currTilePosX]
                )

            let tempTile = blankTile.style.transform
            blankTile.style.transform = currTile.canvas.style.transform
            currTile.canvas.style.transform = tempTile
        }
    }

    let { setCurrPattern, setCurrTilePos } = setters

    // Resetting for the next move
    setCurrPattern([].concat(...pattern))
    setCurrTilePos(null)
}

/** Helpers */

function getTile2dPos(tileIndex, patternToSearch) {
    let currTilePosX
    let currTilePosY

    // Find the clicked tile position
    for(let i = 0; i < patternToSearch.length; i++){
        let currYAxis = patternToSearch[i]
        let findTileXPos = currYAxis.indexOf(tileIndex) 
    
        if(findTileXPos != -1){
            currTilePosX = findTileXPos
            currTilePosY = i
        }
    }

    return [ currTilePosX, currTilePosY ]
}

function swap2d(arr, [y1, x1], [y2, x2]) {
    let temp = arr[y1][x1]
    arr[y1][x1] = arr[y2][x2]
    arr[y2][x2] = temp
}

