const config = {
    type: Phaser.AUTO,      // WebGL if possible
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, // set to true to see collision box + direction of movement
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1440,//4320, //1440,//1440, //800,
    height: 700,//990, // 600 + 140
    backgroundColor: "#1a1a2e",
    scene: [Load, Sewage_Zone] // first scene in the list starts
};

const game = new Phaser.Game(config);