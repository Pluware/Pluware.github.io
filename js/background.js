// js/background.js
// Parallax background with four layers and seamless horizontal looping
// Layers order: sky (back), buildings, wall, sidewalk (front)

export class ParallaxBackground {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} assets - { sky, buildings, wall, sidewalk: Image }
     * @param {Array} layerSpecs - Array of {name, height, speed}
     */
    constructor(canvas, assets, layerSpecs) {
        this.canvas = canvas;
        this.assets = assets;
        this.layerSpecs = layerSpecs;
        this.scrollX = 0;
        this.mapWidth = Math.max(
            ...layerSpecs.map(spec => assets[spec.name]?.width || canvas.width)
        );
    }

    /**
     * @param {number} playerX
     */
    update(playerX) {
        // Scroll position follows the player horizontally
        this.scrollX = playerX;
        // Loop scroll position for endless background
        if (this.scrollX > this.mapWidth) {
            this.scrollX -= this.mapWidth;
        } else if (this.scrollX < 0) {
            this.scrollX += this.mapWidth;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        let yPos = 0;
        for (const spec of this.layerSpecs) {
            const img = this.assets[spec.name];
            if (!img?.complete) continue;
            const layerWidth = img.width || this.canvas.width;
            const layerHeight = spec.height;
            // Parallax offset
            let offset = -this.scrollX * spec.speed;
            offset = ((offset % layerWidth) + layerWidth) % layerWidth; // ensure positive
            // Draw twice for seamless loop
            ctx.drawImage(img, offset, yPos, layerWidth, layerHeight);
            ctx.drawImage(img, offset - layerWidth, yPos, layerWidth, layerHeight);
            yPos += layerHeight;
        }
    }
}

// Usage example in your main game file (game.js):
/*
import { ParallaxBackground } from './js/background.js';
const layerSpecs = [
  {name: "sky", height: 800, speed: 0.02},
  {name: "buildings", height: 400, speed: 0.05},
  {name: "wall", height: 200, speed: 0.1},
  {name: "sidewalk", height: 100, speed: 0.2}
];
// Preload assets.sky, assets.buildings, assets.wall, assets.sidewalk
const background = new ParallaxBackground(canvas, assets, layerSpecs);
// In your game loop:
background.update(player.x);
background.render(ctx);
*/