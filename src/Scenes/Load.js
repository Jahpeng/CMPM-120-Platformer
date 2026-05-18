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
        this.load.image("jump1", "alienGreen_jump.png");
        this.load.image("duck1", "alienGreen_duck.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("tilemap_tiles2", "tilemap_packed2.png"); 
        this.load.tilemapTiledJSON("platformer_sewage_level", "platformer_sewage_level.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("tilemap_sheet2", "tilemap_packed2.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        // Basic structure copied from Professor's lectures
        this.anims.create({
            key: 'walk',
            frames: [
                {key: "walk1"},
                {key: "walk2"},
            ],
            frameRate: 3,
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
            key: 'duck',
            frames: [
                {key: "duck1" }
            ],
        });

        this.anims.create({
            key: 'jump',
            frames: [
                {key: "jump1" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("sewage_zone");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}