const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';
backgroundImg.onerror = () => { console.error("Background image failed to load!"); };

const playerImg = new Image();
playerImg.src = 'assets/player.png';
playerImg.onerror = () => { console.error("Player image failed to load!"); };

const enemyImg = new Image();
enemyImg.src = 'assets/enemy.png';
enemyImg.onerror = () => { console.error("Enemy image failed to load!"); };

const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';
bulletImg.onerror = () => { console.error("Bullet image failed to load!"); };

// Floor level (bottom of canvas minus character height and a little offset)
const FLOOR_Y = canvas.height - 60;

// Game objects
const player = {
    x: canvas.width / 2 - 20,
    y: FLOOR_Y,
    w: 40,
    h: 40,
    speed: 2, // slower walking speed
    dx: 0
};

const bullets = [];
const enemies = [];

let keys = {};

// Handle input (horizontal movement only)
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
        speed: 4 // slower bullet speed
    });
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: FLOOR_Y,
        w: 40,
        h: 40,
        speed: 1 + Math.random() * 1 // slow walking speed
    });
}

function update() {
    // Player horizontal movement only
    player.dx = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) player.dx = -player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.dx = player.speed;

    player.x += player.dx;

    // Boundaries
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = FLOOR_Y; // always at floor

    // Update bullets (vertical motion)
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -bullets[i].h) bullets.splice(i, 1);
    }

    // Update enemies (horizontal motion towards player)
    for (let i = enemies.length - 1; i >= 0; i--) {
        // Enemies move towards player horizontally
        if (enemies[i].x < player.x) enemies[i].x += enemies[i].speed * 0.5;
        if (enemies[i].x > player.x) enemies[i].x -= enemies[i].speed * 0.5;

        enemies[i].y = FLOOR_Y; // always at floor
        // Remove if overlapped player (optional: implement collision to reduce health)
        if (rectsCollide(enemies[i], player)) {
            enemies.splice(i, 1);
        }
    }

    // Collision (bullet hits enemy)
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
    if (Math.random() < 0.01) spawnEnemy();
}

function rectsCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function draw() {
    // Draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    // Draw bullets
    for (const b of bullets) {
        ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
    }

    // Draw enemies
    for (const e of enemies) {
        ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Wait until all images are loaded
let imagesLoaded = 0;
[backgroundImg, playerImg, enemyImg, bulletImg].forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 4) loop();
    };
});