class Sewage_Zone extends Phaser.Scene {
    constructor(){
        super("sewage_zone");
        this.my = {sprite: {}, vfx: {}};
    }

    // Basic structure copied from Professor's lectures
    init() {
        // variables and settings
        this.ACCELERATION = 500; //500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -400;//-500;//-900;
        this.SPAWNX = 40;
        this.SPAWNY = 40;
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
        this.tileset2 = this.map.addTilesetImage("kenny_tilemap_packed2", "tilemap_tiles2");
        //bounding layer so that player doesnt fall outa map
        this.boundLayer = this.map.createLayer("Bounding", this.tileset, 0, 0);
        this.boundLayer.setScale(.67);

        this.boundLayer.setCollisionByProperty({
            collides: true
        });

        //OBJECTS (SPAWNS, COINS, POWERUPS)
        this.spawn = this.map.createFromObjects("SpawnPoints", {
            name: "spawn",
            key: "tilemap_sheet",
            frame: 58 // the tile ID number in properties
        })
        // chatgpt suggested code for correctly resizing to match camera and map:
        this.spawn.forEach(obj => {
            obj.setScale(0.67);
            obj.x *= 0.67;
            obj.y *= 0.67;
        });
        this.physics.world.enable(this.spawn, Phaser.Physics.Arcade.STATIC_BODY);
        this.spawnGroup = this.add.group(this.spawn);

        //TEMP: JUST FOR TESTING (WORKING NOW)
        this.TEMP = this.map.createLayer("TEMP", this.tileset2, 0, 0);
        this.TEMP.setScale(.67);

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

        //PLAYER DAMAGED IF IN SEWAGE
        this.physics.add.overlap(my.sprite.player, this.sewageLayer, (obj1, obj2)=>{
            let sewage = obj2.properties?.danger == true;

            if (sewage){
                setTimeout(() => {my.sprite.player.setPosition(this.SPAWNX, this.SPAWNY);}, 150);
            }
        })

        //OBJECTS (SPAWNS, COINS, POWERUPS)
        this.physics.add.overlap(my.sprite.player, this.spawnGroup, (obj1, obj2) => {
           this.SPAWNX = obj2.x;
           this.SPAWNY = obj2.y; 
        });

        // PLAYER CAMERA
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        // this.cameras.main.setBounds(0,0,game.config.width*2, game.config.height*2); THIS WORKS
        this.cameras.main.setBounds(0,0,1440, 350);
        // this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setFollowOffset(0,0);
        this.cameras.main.setDeadzone(25, 25);
        this.cameras.main.setZoom(3);

        // fixing invisble wall issue
        // this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //PARTICLES
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_04.png'],
            random: true,
            scale: {start: 0.03, end: 0.1},
            maxAliveParticles: 8,
            lifespan: 350,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
            frequency: 100
        });
        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: "dirt_02.png",
            lifespan: 200,
            // scale: { start: 0.2, end: 0 },
            quantity: 1,
            // // maxAliveParticles: 8,
            // alpha: {start: 1, end: 0.1},
            speed: { min: 20, max: 80 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 1, end: 0 },
        })
        my.vfx.jump.stop();
    }

    update(){
        let my = this.my;

        // this coruching section was suggested by chatgpt to fix crouching visual bug
        this.crouching = this.skey.isDown && my.sprite.player.body.blocked.down;
        if (this.crouching) {
            my.sprite.player.body.setOffset(0, -20);
        }
        else {
            my.sprite.player.body.setOffset(0, 0);
        }
        

        // PLAYER MOVEMENT (base structure from platformer section assignment)
        if (this.akey.isDown){
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            // my.sprite.player.resetFlip();
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // my.sprite.player.body.setOffset(0, 0);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);
            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
        }
        else if (this.dkey.isDown){
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            // my.sprite.player.setFlip(true, false);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // my.sprite.player.body.setOffset(0, 0);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);
            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
        }
        else if (this.skey.isDown){
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            //my.sprite.player.resetFlip();
            my.sprite.player.anims.play('duck', true);
            my.vfx.walking.stop();

            // if(my.sprite.player.body.blocked.down){
            //     my.sprite.player.body.setOffset(0, -20);
            // }
            // else{
            //     my.sprite.player.body.setOffset(0, 0);
            // }

            my.sprite.player.body.setOffset(0, -20);
            // if (this.skey.isUp){
            //     my.sprite.player.body.setOffset(0, 0);
            // }
        }
        else{
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            // my.sprite.player.body.setOffset(0, 0);
        }

        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
            // my.sprite.player.body.setOffset(0, 0);
        }
        if(my.sprite.player.body.blocked.down) {
            this.jumps = 0;
        }
        // if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.spacekey)) {
        //     // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
        //     my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        // }
        if (Phaser.Input.Keyboard.JustDown(this.spacekey)){
            if (this.jumps < 2){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jumps += 1;
                my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2, false);
                // my.vfx.jump.start();
                my.vfx.jump.explode(2, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2);
            }
        }
    }
}