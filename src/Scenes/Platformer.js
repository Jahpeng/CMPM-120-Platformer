class Sewage_Zone extends Phaser.Scene {
    constructor(){
        super("sewage_zone");
        this.my = {sprite: {}};
    }

    // Basic structure copied from Professor's lectures
    init() {
        // variables and settings
        this.ACCELERATION = 500; //500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;//-900;
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image("player_character", "alienGreen_stand.png");
    }

    create(){
        let my = this.my;

        // Addding MAP (Using same structure as platformer section assignment)
        this.map = this.add.tilemap("platformer_sewage_level", 18, 18, 120, 20);
        // Adding tileset to map
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        //bounding layer so that player doesnt fall outa map
        this.boundLayer = this.map.createLayer("Bounding", this.tileset, 0, 0);
        this.boundLayer.setScale(.67);

        this.boundLayer.setCollisionByProperty({
            collides: true
        });

        // Making ground layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(.67);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Making sewage layer 
        this.sewageLayer = this.map.createLayer("Sewage", this.tileset, 0, 0);
        this.sewageLayer.setScale(.67);

        // Making aesthetic layer
        this.aestheticLayer = this.map.createLayer("Nice visuals", this.tileset, 0, 0);
        this.aestheticLayer.setScale(.67);


        // Code from CHATGPT that prevents weird invisible wall bug
        this.physics.world.setBounds(0,0,game.config.width,game.config.height);

        // PLAYER SPRITE SETUP
        my.sprite.player = this.physics.add.sprite(40, 40, "player_character").setScale(0.2);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(200, 1000); // makes sure player doesnt become a speed demon

        // PLAYER MOVEMENT SETUP
        this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // PLAYER COLLISION
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.boundLayer);

        // PLAYER CAMERA
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0,0,game.config.width*2, game.config.height*2);
        // this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setFollowOffset(0,0);
        this.cameras.main.setZoom(3);

        // fixing invisble wall issue
        // this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    update(){
        let my = this.my;
        

        // PLAYER MOVEMENT (base structure from platformer section assignment)
        if (this.akey.isDown){
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            // my.sprite.player.resetFlip();
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
        }
        else if (this.dkey.isDown){
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            // my.sprite.player.setFlip(true, false);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
        }
        else if (this.skey.isDown){
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            //my.sprite.player.resetFlip();
            my.sprite.player.anims.play('duck', true);
        }
        else{
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
        }

        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.spacekey)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }
    }
}