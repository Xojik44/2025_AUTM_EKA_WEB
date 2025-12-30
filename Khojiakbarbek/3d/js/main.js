const DEG = Math.PI / 180;
var world = document.getElementById("world");
var container = document.getElementById("container");

// Pointer lock
var lock = false;
document.addEventListener("pointerlockchange", () => {
    lock = !lock;
});
container.onclick = function () {
    if (!lock) container.requestPointerLock();
};

let score = 0;
let scoreEl;

// Crosshair
let crosshair = document.createElement("div");
crosshair.style.position = "absolute";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.width = "20px";
crosshair.style.height = "20px";
crosshair.style.marginLeft = "-10px";
crosshair.style.marginTop = "-10px";
crosshair.style.border = "2px solid black";
crosshair.style.borderRadius = "50%";
container.appendChild(crosshair);

scoreEl = document.createElement("div");
scoreEl.style.position = "absolute";
scoreEl.style.top = "20px";
scoreEl.style.left = "20px";
scoreEl.style.fontSize = "24px";
scoreEl.style.fontFamily = "Arial";
scoreEl.style.color = "black";
scoreEl.style.zIndex = "1000";
scoreEl.innerText = "Score: 0";
container.appendChild(scoreEl);

// Player
function player(x, y, z, rx, ry, vx, vy, vz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.onGround = false;
}

var pawn = new player(0, 0, 0, 0, 0, 7, 7, 7);
var myBullets = [];
var myBulletNumber = 0;

// World
let myRoom = [
    [0, 100, 0, 90, 0, 0, 2000, 2000, "brown", 1, "url('textures/lava.jpg')"],
    [0, -300, 0, 90, 0, 0, 2000, 2000, "red", 1],
    [1000, 100, 0, 0, 90, 0, 2000, 1000, "lightgreen", 1, "url('textures/ad.jpg')"],
    [-1000, 100, 0, 0, 90, 0, 2000, 1000, "lightcoral", 1, "url('textures/ad.jpg')"],
    [0, 100, 1000, 0, 0, 0, 2000, 1000, "lightyellow", 1, "url('textures/ad.jpg')"],
    [0, 100, -1000, 0, 0, 0, 2000, 1000, "lightblue", 1, "url('textures/ad.jpg')"],
    [ -950, 40, -300, 90, 0, 0, 80, 80, "darkgrey", 1, "url('textures/blok.jpg')"],
    [ -950, 0, 350, 90, 0, 0, 80, 80, "darkred", 1, "url('textures/blok.jpg')"],
    [ -950, -60, 0, 90, 0, 0, 80, 80, "darkred", 1, "url('textures/blok.jpg')"],
    [ -950, 0, 650, 90, 0, 0, 80, 80, "darkred", 1, "url('textures/blok.jpg')"],
    [ -950, -60, 950, 90, 0, 0, 80, 80, "green", 1, "url('textures/blok.jpg')"],
    [ -450, -80, 950, 90, 0, 0, 80, 80, "yellow", 1, "url('textures/blok.jpg')"],
    [  0, -80, 950, 90, 0, 0, 80, 80, "yellow", 1, "url('textures/blok.jpg')"],
    [  450, -20, 950, 90, 0, 0, 80, 80, "yellow", 1, "url('textures/blok.jpg')"],
    [  950, -20, 950, 90, 0, 0, 80, 80, "yellow", 1, "url('textures/blok.jpg')"],
    [  950, -60, 350, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  950, -80, -150, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  950, -80, -650, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  950, -40, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  350, -40, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  -150, -80, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  -650, -80, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  -950, -40, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  -950, -40, -950, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
    [  -950, -40, -600, 90, 0, 0, 80, 80, "skyblue", 1, "url('textures/blok.jpg')"],
];

drawMyWorld(myRoom, "wall");

// Controls
var pressForward = pressBack = pressRight = pressLeft = pressUp = 0;
var mouseX = mouseY = 0;
var mouseSensitivity = 1;
var dx = dy = dz = 0;
var gravity = 0.2;
var onGround = false;

document.addEventListener("keydown", (event) => {
    if (event.key == "w") pressForward = pawn.vz;
    if (event.key == "s") pressBack = pawn.vz;
    if (event.key == "d") pressRight = pawn.vx;
    if (event.key == "a") pressLeft = pawn.vx;
    if (event.key == " ") pressUp = pawn.vy;
});
document.addEventListener("keyup", (event) => {
    if (event.key == "w") pressForward = 0;
    if (event.key == "s") pressBack = 0;
    if (event.key == "d") pressRight = 0;
    if (event.key == "a") pressLeft = 0;
    if (event.key == " ") pressUp = 0;
});
document.addEventListener("mousemove", (event) => {
    mouseX = event.movementX;
    mouseY = event.movementY;
});

// Shooting
document.addEventListener("click", () => {
    if (lock) {
        drawMyBullet(myBulletNumber);
        myBulletNumber++;
    }
});

// Update loop
function update() {
    dz = +(pressRight - pressLeft) * Math.sin(pawn.ry * DEG) - (pressForward - pressBack) * Math.cos(pawn.ry * DEG);
    dx = +(pressRight - pressLeft) * Math.cos(pawn.ry * DEG) + (pressForward - pressBack) * Math.sin(pawn.ry * DEG);
    dy += gravity;

    if (onGround) {
        dy = 0;
        if (pressUp) {
            dy = -pressUp;
            onGround = false;
        }
    }

    updateBullets();

    let drx = mouseY * mouseSensitivity;
    let dry = mouseX * mouseSensitivity;

    collision(myRoom, pawn);

    mouseX = mouseY = 0;

    pawn.z += dz;
    pawn.x += dx;
    pawn.y += dy;

    if (lock) {
        pawn.rx += drx;
        if (pawn.rx > 57) pawn.rx = 57;
        if (pawn.rx < -57) pawn.rx = -57;
        pawn.ry += dry;
    }

    world.style.transform = `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
}

let game = setInterval(update, 10);

// Draw world
function drawMyWorld(squares, name) {
    for (let i = 0; i < squares.length; i++) {
        let mySquare1 = document.createElement("div");
        mySquare1.id = `${name}${i}`;
        mySquare1.style.position = "absolute";
        mySquare1.style.width = `${squares[i][6]}px`;
        mySquare1.style.height = `${squares[i][7]}px`;
        if (squares[i][10]) {
            mySquare1.style.backgroundImage = squares[i][10];
        } else {
            mySquare1.style.backgroundColor = squares[i][8];
        }
        mySquare1.style.transform = `translate3d(${600 + squares[i][0] - squares[i][6] / 2}px, ${400 + squares[i][1] - squares[i][7] / 2}px, ${squares[i][2]}px) rotateX(${squares[i][3]}deg) rotateY(${squares[i][4]}deg) rotateZ(${squares[i][5]}deg)`;
        mySquare1.style.opacity = squares[i][9];
        world.appendChild(mySquare1);
        squares[i].el = mySquare1;
    }
}

// Collision functions
function collision(mapObj, leadObj) {
    for (let i = 0; i < mapObj.length; i++) {
        let x0 = leadObj.x - mapObj[i][0];
        let y0 = leadObj.y - mapObj[i][1];
        let z0 = leadObj.z - mapObj[i][2];

        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (mapObj[i][6] ** 2 + mapObj[i][7] ** 2)) {
            let x1 = x0 + dx;
            let y1 = y0 + dy;
            let z1 = z0 + dz;

            let point0 = coorTransform(x0, y0, z0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let point1 = coorTransform(x1, y1, z1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
            let normal = coorReTransform(0, 0, 1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);

            if (Math.abs(point1[0]) < (mapObj[i][6] + 70) / 2 && Math.abs(point1[1]) < (mapObj[i][7] + 70) / 2 && Math.abs(point1[2]) < 50) {
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                let point3 = coorReTransform(point1[0], point1[1], 0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) onGround = true;
                } else {
                    dy = y1 - y0;
                }
            }
        }
    }
}

// Transform helpers
function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
    let x1 = x0;
    let y1 = y0 * Math.cos(rxc * DEG) + z0 * Math.sin(rxc * DEG);
    let z1 = -y0 * Math.sin(rxc * DEG) + z0 * Math.cos(rxc * DEG);
    let x2 = x1 * Math.cos(ryc * DEG) - z1 * Math.sin(ryc * DEG);
    let y2 = y1;
    let z2 = x1 * Math.sin(ryc * DEG) + z1 * Math.cos(ryc * DEG);
    let x3 = x2 * Math.cos(rzc * DEG) + y2 * Math.sin(rzc * DEG);
    let y3 = -x2 * Math.sin(rzc * DEG) + y2 * Math.cos(rzc * DEG);
    let z3 = z2;
    return [x3, y3, z3];
}

function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
    let x2 = x3 * Math.cos(rzc * DEG) - y3 * Math.sin(rzc * DEG);
    let y2 = x3 * Math.sin(rzc * DEG) + y3 * Math.cos(rzc * DEG);
    let z2 = z3;
    let x1 = x2 * Math.cos(ryc * DEG) + z2 * Math.sin(ryc * DEG);
    let y1 = y2;
    let z1 = -x2 * Math.sin(ryc * DEG) + z2 * Math.cos(ryc * DEG);
    let x0 = x1;
    let y0 = y1 * Math.cos(rxc * DEG) - z1 * Math.sin(rxc * DEG);
    let z0 = y1 * Math.sin(rxc * DEG) + z1 * Math.cos(rxc * DEG);
    return [x0, y0, z0];
}

// Bullets
function drawMyBullet(num) {
    let myBullet = document.createElement("div");
    myBullet.id = `bullet_${num}`;
    myBullet.style.display = "block";
    myBullet.style.position = "absolute";
    myBullet.style.width = `10px`;
    myBullet.style.height = `10px`;
    myBullet.style.borderRadius = `50%`;
    myBullet.style.backgroundColor = `red`;
    world.appendChild(myBullet);

    let bulletObj = {
        el: myBullet,
        x: pawn.x,
        y: pawn.y,
        z: pawn.z,
        speed: 5,
        dx: Math.sin(pawn.ry * DEG) * Math.cos(pawn.rx * DEG),
        dy: Math.sin(pawn.rx * DEG),
        dz: -Math.cos(pawn.ry * DEG) * Math.cos(pawn.rx * DEG)
    };

    myBullets.push(bulletObj);
    return bulletObj;
}

function updateBullets() {
    for (let i = myBullets.length - 1; i >= 0; i--) {
        let b = myBullets[i];
        b.x += b.dx * b.speed;
        b.y += b.dy * b.speed;
        b.z += b.dz * b.speed;
        b.el.style.transform = `translate3d(${600 + b.x}px, ${400 + b.y}px, ${b.z}px)`;
        if (bulletHitCheck(b)) {
            b.el.remove();
            myBullets.splice(i, 1);
        }
    }
}

function randomPosInRoom() {
    const floor = myRoom.find(obj => obj[8] === "brown");

    const halfW = floor[6] / 2 - 30;
    const halfD = floor[7] / 2 - 30;

    return {
        x: floor[0] + Math.random() * 2 * halfW - halfW,
        z: floor[2] + Math.random() * 2 * halfD - halfD
    };
}

// Spawn zombie
function spawnZombie(pos) {
    const zombie = [
        pos.x, 50, pos.z, 0, 0, 0, 50, 100, null, 1, "url('textures/demon.png')", true
    ];

    myRoom.push(zombie);
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.width = zombie[6] + "px";
    el.style.height = zombie[7] + "px";
    el.style.backgroundColor = "transparent";
    el.style.backgroundImage = zombie[10];
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.opacity = zombie[9];
    el.style.transform = `translate3d(${600 + zombie[0] - zombie[6]/2}px, ${400 + zombie[1] - zombie[7]/2}px, ${zombie[2]}px)
        rotateX(${zombie[3]}deg) rotateY(${zombie[4]}deg) rotateZ(${zombie[5]}deg)`;
    world.appendChild(el);
    zombie.el = el;
}

// Bullet hit
function bulletHitCheck(bullet) {
    for (let i = myRoom.length - 1; i >= 0; i--) {
        let obj = myRoom[i];
        if (!obj[11]) continue;

        let dx = bullet.x - obj[0];
        let dy = bullet.y - obj[1];
        let dz = bullet.z - obj[2];

        if (Math.abs(dx) < obj[6]/2 && Math.abs(dy) < obj[7]/2 && Math.abs(dz) < 50) {
            obj.el.remove();
            myRoom.splice(i, 1);
            score++;
            scoreEl.innerText = "Score: " + score;
            spawnZombie(randomPosInRoom());
            return true;
        }
    }
    return false;
}

// Spawn first zombie
spawnZombie(randomPosInRoom());
