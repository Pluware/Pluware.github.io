export class HUD {
    constructor(canvas, player, score, wave) {
        this.canvas = canvas;
        this.player = player;
        this.score = score;
        this.wave = wave;
        this.el = document.createElement('div');
        this.el.className = 'hud';
        document.body.appendChild(this.el);
    }
    update(player, score, wave) {
        this.player = player;
        this.score = score;
        this.wave = wave;
    }
    render() {
        this.el.textContent = `Health: ${this.player.health} Score: ${this.score} Wave: ${this.wave}`;
    }
}
