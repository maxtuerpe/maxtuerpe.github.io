window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
        e.preventDefault();
    }
}, false);
const backgrounds = [
    "rgb(226,136,17)",
    "rgb(181,0,253)",
    "rgb(255,72,72)",
    "rgb(124,253,107)",
    "rgb(148,216,255)",
]
let gameSpeed = 4.5;
const bird = {
    x: 7,
    y: 5,
    missles: 20,
    score: 0,
    fireMissle(){
        if (this.missles > 0){
            const missle = new Missle(this.x, this.y);
            missle.newMissle();
            missle.move();
            missle.destroy();
            this.missles--;
        }
    },
    moveUp(){
        if(this.y < 10){
            const currentSquare = $('#bird');
            currentSquare.removeAttr('id');
            this.y++;
            $(`.square-${this.x}-${this.y}`).removeClass('hole');
            $(`.square-${this.x}-${this.y}`).attr('id', 'bird');
        }
    },
    moveDown(){
        if(this.y > 1){
            const currentSquare = $('#bird');
            currentSquare.removeAttr('id');
            this.y--;
            $(`.square-${this.x}-${this.y}`).removeClass('hole');
            $(`.square-${this.x}-${this.y}`).attr('id', 'bird');
        }
    }
}
class Bar { 
    constructor( x, hole){
    this.x = x;
    this.hole = hole;
    }
    newBar(){
        for (let i = 0; i < 10; i++){
            if((i+1)!== this.hole){ 
                $(`.square-${this.x}-${i+1}`).removeClass('blank');
                $(`.square-${this.x}-${i+1}`).addClass('box');
            } else {
                $(`.square-${this.x}-${i+1}`).addClass('hole');
            }
        }
    }
    move(){  
        setInterval(()=>{
            if(this.x > 0){
                this.x--;
                for (let i = 0; i < 10; i++){
                    if($(`.square-${this.x + 1}-${i+1}`).hasClass('box')){
                        $(`.square-${this.x + 1}-${i+1}`).removeClass('box');
                        $(`.square-${this.x + 1}-${i+1}`).addClass('blank');
                        $(`.square-${this.x}-${i+1}`).addClass('box');
                    } if($(`.square-${this.x + 1}-${i+1}`).hasClass('hole')){
                        $(`.square-${this.x + 1}-${i+1}`).removeClass('hole');
                        $(`.square-${this.x + 1}-${i+1}`).addClass('blank');
                        $(`.square-${this.x}-${i+1}`).addClass('hole');
                    }
                }   
            gameOver();
            }
        }, 500/gameSpeed); 
    }
    explode(){
        setInterval(()=>{
            for (let i = 0; i < 10; i++){
                if($(`.square-${this.x}-${i+1}`).hasClass('missle')){
                    $('.punch')[0].play();
                    $(`.square-${this.x}-${i+1}`).removeClass('box');
                    $(`.square-${this.x}-${i+1}`).addClass('hole');
                }
            }
        }, 1);
    }
}
class Coin {
    constructor(y){
        this.y = y;
        this.x = 26;
        this.active = true;
    }
    newCoin(){
        $(`.square-${this.x}-${this.y}`).removeClass('blank');
        $(`.square-${this.x}-${this.y}`).addClass('coin');
    }
    move(){
        setInterval(()=>{
            if(this.x > 0){
                $(`.square-${this.x}-${this.y}`).removeClass('coin');
                if(this.active){
                this.x--;
                $(`.square-${this.x + 1}-${this.y}`).addClass('blank');
                $(`.square-${this.x}-${this.y}`).addClass('coin');
                }  
            }
        }, 500/gameSpeed)     
    }
    score(){
        setInterval(()=>{
            if(this.active){
                if($(`.square-${this.x}-${this.y}`)[0].hasAttribute('id', 'bird')){ 
                    bird.score++;
                    $(`.square-${this.x}-${this.y}`).removeClass('coin');
                    this.active = false;  
                }
            } 
        }, 5)    
    }     
} 
class Missle {
    constructor(x, y){
        this.x = x;
        this.y = y; 
        this.active = true;
    }
    newMissle(){
        $(`.square-${this.x}-${this.y}`).addClass('missle');
    }
    move(){
        setInterval(()=>{
            this.x++;
            if(this.active){
                $(`.square-${this.x - 1}-${this.y}`).removeClass('missle');
                $(`.square-${this.x - 1}-${this.y}`).addClass('blank');
                $(`.square-${this.x}-${this.y}`).addClass('missle');
            } else {
                $(`.square-${this.x - 1}-${this.y}`).removeClass('missle');
            } 
        },45)  
    }
    destroy(){
        setInterval(()=>{
            if($(`.square-${this.x}-${this.y}`).hasClass('box')){
            this.active = false;
            }
        },1)   
    } 
}
const hardMode = () => {
    gameSpeed+= .5;
}
const gameOver = () => {
    if($('#bird').hasClass('box')){
        $('.board').empty();
        $('.board').append(`<h1 class="game-over">Game Over!</h1>`)
        $('.board').append(`<button class='button retry'>retry?</button>`)
        $('.retry').on('click', ()=>{
            window.location.reload();
        })
    } 
}
const makeBird = () => {
    $(`.square-${bird.x}-${bird.y}`).attr('id', 'bird');
}
const makeBoard = () => {
    for(let x = 1; x < 26; x++){
        $('.board').append(`<div class='game-column game-column-${x}'></div>`)
        for(let y = 10; y > 0; y--){
            const gameSquare = $('<div/>')
            gameSquare.addClass('square')
            gameSquare.addClass(`square-${x}-${y}`)
            $(`.game-column-${x}`).append(gameSquare)
        }
    }
}
const makeBar = () => {
    setInterval(()=>{
        const bar = new Bar(25, Math.ceil(Math.random()*10))
        bar.newBar();
        bar.explode();
        bar.move();
    },5000/gameSpeed) 
}
const makeCoin = () => {
    setInterval(()=>{
        const coin = new Coin(Math.ceil(Math.random()*10))
        coin.newCoin();
        coin.move();
        coin.score();
    },5000/gameSpeed)
}
$('body').css({'background-color': backgrounds[Math.floor(Math.random() * 5)]});
$('#start-game').on('click', (e)=>{
    (e.currentTarget).remove();
    $('p').remove();
    $('body').append("<div class='bottom'></div>")
    makeBoard();
    makeBird();
    makeBar();
    setTimeout(()=>{
        makeCoin();
    },2000/gameSpeed) 
    $('body').keydown((e)=>{
        if(e.keyCode === 38){
            $('.woosh')[0].play();
            bird.moveUp();
    }});
    $('body').keydown((e)=>{
        if(e.keyCode === 40){
            $('.woosh')[0].play();
            bird.moveDown();
    }});
    $('body').keydown((e)=>{
        if(e.keyCode === 32){
            $('.pew')[0].play();
            bird.fireMissle();
    }});
    setInterval(()=>{
        $('.score').text(`score: ${bird.score}`);
        $('.missles').text(`missles: ${bird.missles}`);
    }, 10)
    $('body').keydown((e)=>{
        if(e.keyCode === 83){
            bird.score+= 234;
        }
    })
    // setInterval(hardMode,3000)
}) 




















