export class BulletManager {
    constructor(assets, canvas, ctx) {
        this.assets = assets;
        this.canvas = canvas;
        this.ctx = ctx;
        this.bullets = [];
    }
    shoot(x, y) {
        this.bullets.push({ x, y, speed: 500 });
    }
    update(dt, enemies, effects) {
        this.bullets = this.bullets.filter(b => {
            b.y -= b.speed * dt;
            return b.y > -10;
        });
    }
    render(ctx) {
        for (const b of this.bullets) {
            if (this.assets.bullet) {
                ctx.drawImage(this.assets.bullet, b.x - 4, b.y - 8);
            } else {
                ctx.fillStyle = '#ff0';
                ctx.fillRect(b.x - 2, b.y - 8, 4, 8);
            }
        }
    }
}
