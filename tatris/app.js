document.addEventListener("DOMContentLoaded", ()=>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const startbtn = document.querySelector('#start-button')
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    score =0 
    console.log(startbtn)


    const ltetromino = [
        [1, width*1+1, width*2+1, 2],
        [width, width*1+1,width*1+2,width*2+2],
        [1, width*1+1, width*2+1, width*2],
        [width,width*2, width*2+1, width*2+2]
    ]

    const ztetromino = [
        [width*1+1, width*1+2, width*2, width*2+1],
        [0, width, width*1+1, width*2+1],
        [width*1+1, width*1+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ]

    const ttetromino = [
        [1, width, width+1, width+2],
        [1, width+1,width*2+1, width+2],
        [width, width+1, width+2,width*2 +1],
        [1, width+1,width*2+1, width]
    ]

    const otetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
    ]

    const itetromino = [
        [1, width*1+1, width*2+1, width*3+1],
        [width, width+1, width+2,width+3],
        [1, width*1+1, width*2+1, width*3+1],
        [width, width+1, width+2,width+3],
    ]

    const tetrominos = [ltetromino, ztetromino, ttetromino, otetromino, itetromino]

    let currentPosition = 6;
    let currentRotation = 0;

    let random = Math.floor(Math.random()*tetrominos.length)
    let current = tetrominos[random][currentRotation]

    function draw (){
        current.forEach(index =>{
            squares[currentPosition+index].classList.add('tetromino')
        })
    }

    function control(e){
        if(e.keyCode == 37){ // left -> move
            moveLeft()

        }else if (e.keyCode == 38){ //up -> rotate
            rotate()
        }else if (e.keyCode == 39){ // right -> move
            moveRight()
        }else if (e.keyCode == 40){
            moveDown()
        } // down -> move
    }
    document.addEventListener('keyup', control)

    function undraw (){
        current.forEach(index =>{
            squares[currentPosition+index].classList.remove('tetromino')
        })
    }

    // timerId = setInterval(moveDown, 1000)
    

    function moveDown(){
        undraw()
        currentPosition+=width;
        draw()
        freeze()
    }


    function freeze(){
        setTimeout(function(){ console.log("Hello"); }, 3000);
        if(current.some(index => squares[currentPosition+index +width].classList.contains('taken'))){
            current.forEach(index=> squares[currentPosition+index].classList.add('taken'))

            //start new tertomino falling

            random = nextRandom
            nextRandom = Math.floor(Math.random()*tetrominos.length)
            current = tetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            dispalayShape()
            dispalayScore()
            endGame()
        }
    }

    function moveLeft(){

        undraw()

        let isAtLeftEdge = current.some(index => (currentPosition+index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition -= 1
        }

        draw()
    }


    function moveRight(){

        undraw()

        let isAtRightEdge = current.some(index => (currentPosition+index) % width === width-1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition -= 1
        }

        draw()
    }

    function rotate(){
        undraw()
        currentRotation = ++currentRotation % current.length
        current = tetrominos[random][currentRotation]
        draw()
    }


    //show up next tetromino

    const displaysquares = document.querySelectorAll('.mini-grid div')

    const displaywidth = 4

    let displayIndex = 0

    const nexttetromino = [
        [1, displaywidth*1+1, displaywidth*2+1, 2], //ltetromino 
        [displaywidth*1+1, displaywidth*1+2, displaywidth*2, displaywidth*2+1], // ztetromino 
        [1, displaywidth, displaywidth+1, displaywidth+2], // ttetromino 
        [0,1,displaywidth,displaywidth+1], // otetromino
        [1, displaywidth*1+1, displaywidth*2+1, displaywidth*3+1] //itetromino
            
    ]
    
// to display shae in next 
    function dispalayShape(){
        
        displaysquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        // console.log('nexttermino cordinates', nexttetromino[nextRandom])
        // console.log('nextrandom', nextRandom)
        nexttetromino[nextRandom].forEach(index => {
            displaysquares[index+ displayIndex].classList.add('tetromino')
        });
    } 

// functionality to start and stop the game

    startbtn.addEventListener('click',() => {
        if(timerId){
            clearInterval(timerId)
            timerId =null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*tetrominos.length)
            dispalayShape()
        }
    })

    // display score and remove complete taken row

    function dispalayScore()
    {
        for (i=0;i<=199;i+=width){
            row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score+=10
                ScoreDisplay.innerHTML = score
                row.forEach((index)=> squares[index].classList.remove('taken'))
                row.forEach((index)=> squares[index].classList.remove('tetromino'))

                removedsquares = squares.splice(i,width)
                squares= removedsquares.concat(squares)
                console.log("squares",squares)
                console.log("grid",grid)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function endGame(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = 'END'
            clearInterval(timerId)
        }
    }
})