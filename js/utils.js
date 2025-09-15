export async function loadAssets() {
    const sources = {
        player: 'assets/player.png',
        enemy: 'assets/enemy.png',
        bullet: 'assets/bullet.png',
    };
    const assets = { sfx: {} };
    await Promise.all(Object.entries(sources).map(([key, src]) => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            assets[key] = img;
        });
    }));
    return assets;
}
