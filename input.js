export class Input {
    constructor(canvas, player, bullets, assets, ui) {
        this.left = false;
        this.right = false;
        this.shoot = false;

        // Keyboard
        window.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = true;
            if (e.code === 'Space') this.shoot = true;
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = false;
        });

        // Mouse/touch shoot
        canvas.addEventListener('mousedown', () => this.shoot = true);
        canvas.addEventListener('touchstart', () => this.shoot = true);

        // Mobile joystick/buttons: (optional, for advanced UX)
        // See style.css for .joystick and .btn classes
    }
}