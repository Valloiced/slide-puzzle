import Tiles from '../Components/Tiles';

export default function generate(canvasRef, tilesContainerRef, currTilesRef, image, pattern, gameSize, setCurrTiles, setCurrTilePos) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const canvasRect = canvas.getBoundingClientRect()

    const dimensions = canvasRect.width
    const tileSize = Math.floor(dimensions / gameSize)
    const margin = 2.5

    const img = new Image;
    img.src = image
    img.onload = () => {

        canvas.width = dimensions
        canvas.height = dimensions
        tilesContainerRef.current.style.height = dimensions - (margin * 2) + "px"
        tilesContainerRef.current.style.width = dimensions - (margin * 2) + "px"

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        let i = 0
        for(let y = 0; y < gameSize; y++){
            for(let x = 0; x < gameSize; x++, i++){

                let yPos = (Math.floor(pattern[i] / gameSize)) * tileSize
                let xPos = (pattern[i] % gameSize) * tileSize

                let imageData = ctx.getImageData(
                    xPos, yPos,
                    tileSize, tileSize
                )

                if(pattern[i] == 0){
                    imageData = createBlankImage(ctx, tileSize)
                }

                let tileToPush = <Tiles 
                    key={"tile" + pattern[i]}
                    i={pattern[i]}
                    index={pattern[i]}
                    img={imageData}
                    x={x * tileSize}
                    y={y * tileSize}
                    size={tileSize - margin}
                    ref={currTilesRef}
                    setClickedTile={setCurrTilePos}
                />

                setCurrTiles(prev => [...prev, tileToPush])
            }
        }
    }
}

function createBlankImage(ctx, dimensions){
    let blankTile = ctx.createImageData(dimensions, dimensions)
        for(let i = 0; i < blankTile.data.length; i++){
            blankTile.data[i] = 255
    }
    return blankTile
}