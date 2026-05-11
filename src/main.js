const config = {
    type: Phaser.AUTO,      // WebGL if possible
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 800,
    height: 740, // 600 + 140
    backgroundColor: "#1a1a2e",
    scene: [] // first scene in the list starts
};

const game = new Phaser.Game(config);