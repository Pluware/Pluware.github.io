export class EnemyManager {
    constructor(assets, canvas, ctx) {
        this.assets = assets;
        this.canvas = canvas;
        this.ctx = ctx;
        this.enemies = [];
    }
    spawnWave(wave) {
        for (let i = 0; i < wave; i++) {
            this.enemies.push({ x: 50 + i * 60, y: 40, speed: 50 });
        }
    }
    update(dt, player, bullets, effects, wave) {
        for (const e of this.enemies) {
            e.y += e.speed * dt;
        }
        // Remove enemies off screen
        this.enemies = this.enemies.filter(e => e.y < this.canvas.height + 40);
    }
    render(ctx) {
        for (const e of this.enemies) {
            if (this.assets.enemy) {
                ctx.drawImage(this.assets.enemy, e.x - 20, e.y - 20);
            } else {
                ctx.fillStyle = '#f00';
                ctx.fillRect(e.x - 20, e.y - 20, 40, 40);
            }
        }
    }
    cleared() {
        return this.enemies.length === 0;
    }
}
