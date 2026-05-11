class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        // this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        this.load.image("walk1", "alienGreen_walk1.png");
        this.load.image("walk2", "alienGreen_walk2.png");
        this.load.image("stand", "alienGreen_stand.png");
        this.load.image("jump1", "alienGreen_stand.png");

        // Load tilemap information
        // this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        // this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: [
                {key: "walk1"},
                {key: "walk2"},
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [
                {key: "stand" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                {key: "jump1" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}