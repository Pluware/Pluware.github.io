const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const playerImg = new Image();
playerImg.src = 'assets/player.png';

const enemyImg = new Image();
enemyImg.src = 'assets/enemy.png';

const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';

// Game objects
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    w: 40,
    h: 40,
    speed: 5,
    dx: 0,
    dy: 0
};

const bullets = [];
const enemies = [];

let keys = {};

// Handle input
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        shoot();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function shoot() {
    bullets.push({
        x: player.x + player.w / 2 - 5,
        y: player.y,
        w: 10,
        h: 20,
        speed: 8
    });
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        w: 40,
        h: 40,
        speed: 2 + Math.random() * 2
    });
}

// Game loop
function update() {
    // Player movement
    player.dx = 0;
    player.dy = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) player.dx = -player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.dx = player.speed;
    if (keys['ArrowUp'] || keys['KeyW']) player.dy = -player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) player.dy = player.speed;

    player.x += player.dx;
    player.y += player.dy;

    // Boundaries
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -bullets[i].h) bullets.splice(i, 1);
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        if (enemies[i].y > canvas.height) enemies.splice(i, 1);
    }

    // Collision
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (rectsCollide(enemies[i], bullets[j])) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }
    }

    // Enemy spawn
    if (Math.random() < 0.02) spawnEnemy();
}

// Simple rectangle collision
function rectsCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Drawing
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    // Bullets
    for (const b of bullets) {
        ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
    }

    // Enemies
    for (const e of enemies) {
        ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
    }
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start when images are loaded
playerImg.onload = () => {
    enemyImg.onload = () => {
        bulletImg.onload = () => {
            loop();
        };
    };
};