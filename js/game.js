// Modular JS: Only keep game.js in index.html, import other modules here
import { Player } from './player.js';
import { EnemyManager } from './enemy.js';
import { BulletManager } from './bullet.js';
import { PowerupManager } from './powerup.js';
import { HUD } from './hud.js';
import { Effects } from './effects.js';
import { Input } from './input.js';
import { loadAssets } from './utils.js';

// Canvas and UI overlay
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = document.getElementById('ui-overlay');

// Responsive scaling
function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Maintain aspect ratio (e.g., 3:2)
    let scale = Math.min(w / 1200, h / 800);
    canvas.style.width = (1200 * scale) + 'px';
    canvas.style.height = (800 * scale) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game state
let state = 'menu'; // 'playing', 'paused', 'gameover'

// Assets
let assets = {};
loadAssets().then(a => { assets = a; showMenu(); });

// Load background layers
const bgLayers = {
    sky: new Image(),
    buildings: new Image(),
    wall: new Image(),
    sidewalk: new Image()
};
bgLayers.sky.src = "assets/sky.png";
bgLayers.buildings.src = "assets/buildings.png";
bgLayers.wall.src = "assets/wall.png";
bgLayers.sidewalk.src = "assets/sidewalk.png";

// Parallax offsets for each layer
let parallaxOffsets = {
    sky: 0,
    buildings: 0,
    wall: 0,
    sidewalk: 0
};

// Parallax speeds (adjust as desired)
const parallaxSpeed = {
    sky: 0.02,
    buildings: 0.05,
    wall: 0.1,
    sidewalk: 0.2
};

// Update parallax based on player movement
function updateParallax(playerX) {
    parallaxOffsets.sky = -playerX * parallaxSpeed.sky;
    parallaxOffsets.buildings = -playerX * parallaxSpeed.buildings;
    parallaxOffsets.wall = -playerX * parallaxSpeed.wall;
    parallaxOffsets.sidewalk = -playerX * parallaxSpeed.sidewalk;
}

// Draw all background layers in order
function drawBackground(ctx, canvas, playerX = 0) {
    updateParallax(playerX);

    // Sky (fills canvas)
    ctx.drawImage(bgLayers.sky, parallaxOffsets.sky, 0, canvas.width, canvas.height);

    // Buildings (middle, starts at y=400)
    ctx.drawImage(bgLayers.buildings, parallaxOffsets.buildings, 400, canvas.width, 400);

    // Wall (above sidewalk, starts at y=600)
    ctx.drawImage(bgLayers.wall, parallaxOffsets.wall, 600, canvas.width, 200);

    // Sidewalk (bottom foreground, starts at y=700)
    ctx.drawImage(bgLayers.sidewalk, parallaxOffsets.sidewalk, 700, canvas.width, 100);
}

// --- In your render/game loop, before drawing player/enemies/bullets ---
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas, player.x);

    // ...draw game objects after background...
}

let player, enemies, bullets, powerups, hud, effects, input;
let score = 0, wave = 1;

// Show start menu
function showMenu() {
    ui.innerHTML = `
        <div class="menu active">
            <h1>2D Shooter</h1>
            <button onclick="startGame()">Play</button>
            <button onclick="showInstructions()">Instructions</button>
            <button onclick="showSettings()">Settings</button>
        </div>
    `;
    state = 'menu';
}
window.showMenu = showMenu;

// Show instructions
function showInstructions() {
    ui.innerHTML = `
        <div class="menu active">
            <h2>Instructions</h2>
            <p>Move: Arrow keys / WASD / Joystick<br>Shoot: Space / Tap / Button<br>Pause: P / Button</p>
            <button onclick="showMenu()">Back</button>
        </div>
    `;
}
window.showInstructions = showInstructions;

// Show settings
function showSettings() {
    ui.innerHTML = `
        <div class="menu active">
            <h2>Settings</h2>
            <label>
                <input type="checkbox" id="muteMusic" onchange="toggleMusic()">
                Mute Music
            </label>
            <button onclick="showMenu()">Back</button>
        </div>
    `;
}
window.showSettings = showSettings;
window.toggleMusic = function() {
    if (assets.music) assets.music.muted = document.getElementById('muteMusic').checked;
};

// Start game
function startGame() {
    ui.innerHTML = '';
    state = 'playing';
    score = 0;
    wave = 1;
    player = new Player(assets, canvas, ctx);
    enemies = new EnemyManager(assets, canvas, ctx);
    bullets = new BulletManager(assets, canvas, ctx);
    powerups = new PowerupManager(assets, canvas, ctx);
    hud = new HUD(canvas, player, score, wave);
    effects = new Effects(assets, canvas, ctx);
    input = new Input(canvas, player, bullets, assets, ui);
    assets.music && assets.music.play();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

window.startGame = startGame;

// Pause menu
function showPause() {
    state = 'paused';
    ui.innerHTML = `
        <div class="pause active">
            <h2>Paused</h2>
            <button onclick="resumeGame()">Resume</button>
            <button onclick="startGame()">Restart</button>
            <button onclick="showMenu()">Quit</button>
        </div>
    `;
}
window.showPause = showPause;

function resumeGame() {
    ui.innerHTML = '';
    state = 'playing';
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}
window.resumeGame = resumeGame;

// Game over screen
function showGameOver() {
    state = 'gameover';
    ui.innerHTML = `
        <div class="gameover active">
            <h2>Game Over!</h2>
            <p>Final Score: ${score}</p>
            <button onclick="startGame()">Replay</button>
            <button onclick="showMenu()">Menu</button>
        </div>
    `;
    // Save high score
    let hs = JSON.parse(localStorage.getItem('highscores') || '[]');
    hs.push(score);
    hs = hs.sort((a,b)=>b-a).slice(0,10);
    localStorage.setItem('highscores', JSON.stringify(hs));
}
window.showGameOver = showGameOver;

// Main game loop
let lastTime = performance.now();
function gameLoop(now) {
    if (state !== 'playing') return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Update
    player.update(dt, input, bullets, effects);
    enemies.update(dt, player, bullets, effects, wave);
    bullets.update(dt, enemies, effects);
    powerups.update(dt, player, effects);
    effects.update(dt);
    // Difficulty/wave increase
    if (enemies.cleared()) {
        wave++;
        enemies.spawnWave(wave);
    }
    // Score
    score = player.score;
    hud.update(player, score, wave);

    // Render
    render();

    // Check game over
    if (player.health <= 0) {
        showGameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Render function, parallax backgrounds, only redraw as needed
function renderBackground() {
    // Parallax backgrounds
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (assets.background2) ctx.drawImage(assets.background2, 0, 0, canvas.width, canvas.height);
    if (assets.background) ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
  renderBackground();
}

function render() {
    
    // Game objects
    powerups.render(ctx);
    player.render(ctx);
    bullets.render(ctx);
    enemies.render(ctx);
    effects.render(ctx);

    // HUD
    hud.render();
}

// Keyboard pause control
window.addEventListener('keydown', e => {
    if (e.code === 'KeyP' && state === 'playing') showPause();
});
