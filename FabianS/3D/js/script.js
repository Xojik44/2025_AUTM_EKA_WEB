

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// https://polyhaven.com/
// https://www.fr.de/panorama/geschichte-vom-louvre-passwort-bis-zu-den-atom-codes-die-schlimmsten-security-fails-der-94028611.html
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const DEG = Math.PI / 180;

let container = document.getElementById("container")
var world = document.getElementById("world");


let drx = 0;
let dry = 0
let drz = 0;
let dx = 0;
let dy = 0;
let dz = 0


let gravity = 0.2

// geeignet um ausserhalb der Kontur zu sein und Features zu testen 
let jump 
jump = true
// jump = false 

let move = 0;
let mySquares = []
let mouseX = 0
let mouseY = 0;
let mouseSensitivity = 0.5


let onGround = false; 

let pressForward = 0
let pawn 
// window.pawn = pawn 

let pressBack = 0
let pressRight = 0
let pressLeft = 0;
let pressUp = 0

let lock = false 

// 3x3 2d Rotation

// Konstruktor
function player(
    x,
    y,
    z,
    rx,
    ry,
    vx,
    vy,
    vz
){
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.onGround = false 
}


function update(){
    // original
    dz = +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * Math.cos(pawn.ry * DEG)
    dx = +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * Math.sin(pawn.ry * DEG)
    dy += gravity;


    if (onGround) {
        dy = 0;
        if (pressUp) {
            console.log("jump");
            dy = -pressUp;
            onGround = false;
        }
    }
    let drx = mouseY * mouseSensitivity;
    let dry = mouseX * mouseSensitivity;
    
    collision(
        window.myRoom, 
        pawn
    )

    mouseX = 0
    mouseY = 0;

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy

    

    if (lock) {
        pawn.rx += drx;
        if (pawn.rx > 57) {
            pawn.rx = 57;
        } else if (pawn.rx < -57) {
            pawn.rx = -57;
        }
        pawn.ry += dry;
    }



    if(jump){
        world.style.transform = `
            translateZ(600px) 
            rotateX(${-pawn.rx}deg) 
            rotateY(${pawn.ry}deg) 
            translate3d(
                ${-pawn.x}px, 
                ${-pawn.y}px
                ,${-pawn.z}px
            )
        `;
    }
    else{
        world.style.transform = `
            translateZ(600px) 
            rotateX(${-pawn.rx}deg) 
            rotateY(${pawn.ry}deg) 
            translate3d(
                ${-pawn.x}px, 
                0px
                ,${-pawn.z}px
            )
        `; 
    }

    // interactTeleport(spelesElementi[level][2], izvObj)
}



let game = setInterval(
    update,
    10
);
if(jump){
    pawn = new player(
        0,
        0,
        0,
        0,
        -90,// Rotation um y
        7,
        7,
        7
    );
}
else{
    pawn = new player(
        -2000,
        0,
        0,
        0,
        0,
        7,
        7,
        7
    );
}


document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
})
container.onclick = function () {
    if(!lock){
        container.requestPointerLock();
    }
}




// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// draw My World
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%





// Würfel 
// drawMyWorld(squares, "MMM");





// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// movement
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

document.addEventListener("keydown", (event) => {
    if(event.key == "w"){
        pressForward = pawn.vz;
    }
    if(event.key == "s"){
        pressBack = pawn.vz;
    }
    if(event.key == "d"){
        pressRight = pawn.vx;
    }
    if(event.key == "a"){
        pressLeft = pawn.vx;
    }
    if (event.key == " ") {
        // console.log("pressUP"),
        pressUp = pawn.vy;
    }
})

document.addEventListener("keyup", (event) => {
if(event.key == "w"){
        pressForward = 0;
    }
    if(event.key == "s"){
        pressBack = 0;
    }
    if(event.key == "d"){
        pressRight = 0;
    }
    if(event.key == "a"){
        pressLeft = 0;
    }
    if (event.key == " ") {
        // console.log("asda")
        pressUp = 0;
    }
})

document.addEventListener("mousemove",(event) => {
    mouseX = event.movementX;
    mouseY = event.movementY;
})