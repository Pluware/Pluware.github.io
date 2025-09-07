export class Player {
    constructor(assets, canvas, ctx) {
        this.assets = assets;
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = canvas.width / 2 - 20;
        this.y = canvas.height - 70;
        this.w = 40;
        this.h = 40;
        this.speed = 3;
        this.health = 100;
        this.ammo = 10;
        this.score = 0;
        this.powerup = null;
        this.spriteFrame = 0;
        this.spriteTimer = 0;
    }
    update(dt, input, bullets, effects) {
        // Movement (keyboard/touch)
        if (input.left) this.x -= this.speed;
        if (input.right) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.canvas.width - this.w, this.x));

        // Shoot (space/mouse/touch)
        if (input.shoot && this.ammo > 0) {
            bullets.shoot(this.x + this.w / 2, this.y);
            this.ammo--;
            input.shoot = false;
            this.assets.sfx.shoot && this.assets.sfx.shoot.play();
        }

        // Powerup effects (shield, rapid, bomb)
        if (this.powerup === 'shield') {/* ... */}
        if (this.powerup === 'rapid') {/* ... */}
        if (this.powerup === 'bomb') {/* ... */}

        // Animate sprite
        this.spriteTimer += dt;
        if (this.spriteTimer > 0.15) {
            this.spriteFrame = (this.spriteFrame + 1) % 4;
            this.spriteTimer = 0;
        }
    }
    render(ctx) {
        // Draw animated sprite frame
        if (this.assets.player) {
            ctx.drawImage(this.assets.player, this.spriteFrame * 40, 0, 40, 40, this.x, this.y, this.w, this.h);
        }
    }
}