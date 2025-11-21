const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 200, 200)

let myPlayGround = new Image();
myPlayGround.src = "ground.png";

let myFood = new Image();
myFood.src = "trophy.png";

let box = 32;
let food_coords = {
    x:(Math.floor(Math.random()*17+1))*box,
    y:(Math.floor(Math.random()*15+3))*box,
    type: "cup"
}

let snakeX = 0;
let snakeY = 0;
let dir = "wait";
 

    
let snake = []; 
snake[0] = {
    x: 9*box,
    y: 10*box

}

//snake.unshift(newHead);
//snake.pop();

document.addEventListener("keypress", (event) =>{
    if(event.key == "w" && dir != "down") {
        dir = "up";
    }
    if(event.key == "s" && dir != "up") {
        dir = "down";
    }
    if(event.key == "a" && dir != "right") {
        dir = "left";
    }
    if(event.key == "d" && dir != "left") {
        dir = "right";
    }
})

function drawGame() {
    ctx.drawImage(myPlayGround, 0, 0);
    ctx.drawImage(myFood, food_coords.x, food_coords.y);
    ctx.fillStyle = "#a641e0";
    for(let i = 0; i < snake.length; i++){
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    snakeX = snake[0].x;
    snakeY = snake[0].y;
    if(dir == "left") snakeX -= box;
    if(dir == "right") snakeX += box;
    if(dir == "up") snakeY -= box;
    if(dir == "down") snakeY += box;

    if(snakeX == food_coords.x && snakeY == food_coords.y){ 

        food_coords = {
            x:(Math.floor(Math.random()*17+1))*box,
            y:(Math.floor(Math.random()*15+3))*box,
            type: "cup"
        };
    } else {
        snake.pop();
    }

    if (
    snakeX < box || 
    snakeX > 18 * box ||
    snakeY < 2 * box ||
    snakeY > 18 * box
) {
    clearInterval(myGame);
    alert("💀 GAME OVER!");
}

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}
    
let myGame = setInterval(drawGame, 100);
