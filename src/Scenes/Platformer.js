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
        this.hit = false;
        this.SCORE = 0;
        this.LIVES = 5;
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image("player_character", "alienGreen_stand.png");
        this.load.audio("jump_sound", "impactGlass_heavy_001.ogg");
        this.load.audio("coin_touched", "powerUp2.ogg");
        this.load.audio("powered", "tone1.ogg");
        this.load.audio("dead", "phaserDown1.ogg");
    }

    create(){
        let my = this.my;

        this.jump_sound = this.sound.add("jump_sound", {loop: false, volume: 1});
        this.coin_touched = this.sound.add("coin_touched", {loop: false, volume: 1});
        this.powered = this.sound.add("powered", {loop: false, volume: 1});
        this.dead = this.sound.add("dead", {loop: false, volume: 1});

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

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet2",
            frame: 90
        });
        this.coins.forEach(obj => {
            obj.setScale(0.67);
            obj.x *= 0.67;
            obj.y *= 0.67;
        });
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.power = this.map.createFromObjects("Objects", {
            name: "power",
            key: "tilemap_sheet2",
            frame: 42 // the tile ID number in properties
        });
        this.power.forEach(obj => {
            obj.setScale(0.67);
            obj.x *= 0.67;
            obj.y *= 0.67;
        });
        this.physics.world.enable(this.power, Phaser.Physics.Arcade.STATIC_BODY);
        this.powergroup = this.add.group(this.power);

        this.exit = this.map.createFromObjects("Objects", {
            name: "exit",
            key: "tilemap_sheet",
            frame: 28 // the tile ID number in properties
        });
        this.exit.forEach(obj => {
            obj.setScale(0.67);
            obj.x *= 0.67;
            obj.y *= 0.67;
        });
        this.physics.world.enable(this.exit, Phaser.Physics.Arcade.STATIC_BODY);
        this.exitgroup = this.add.group(this.exit);


        //TEMP: JUST FOR TESTING (WORKING NOW)
        // this.TEMP = this.map.createLayer("TEMP", this.tileset2, 0, 0);
        // this.TEMP.setScale(.67);

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
        this.liveText = this.add.text(4, 4, "Lives: 5", {
            fontSize: "16px",
            color: "#ffffff"
        });

        this.physics.add.overlap(my.sprite.player, this.sewageLayer, (obj1, obj2)=>{
            let sewage = obj2.properties?.danger == true;

            // if (sewage){
            //     this.hit = true;
            //     this.dead.play()
            //     setTimeout(() => {my.sprite.player.setPosition(this.SPAWNX, this.SPAWNY); this.hit = false;}, 150);
            // }
            // suggested by chatgpt to fix lives deduction bug where lives were beinging taken per frame rather than per hit
            if (!sewage || this.hit) return; 
            this.hit = true;
            this.LIVES -= 1;
            this.liveText.setText("Lives: " + this.LIVES);
            this.dead.play();
            my.sprite.player.setPosition(this.SPAWNX, this.SPAWNY - 20);
            this.time.delayedCall(300, () => {this.hit = false;});
        })

        //OBJECTS (SPAWNS, COINS, POWERUPS)
        this.physics.add.overlap(my.sprite.player, this.spawnGroup, (obj1, obj2) => {
           this.SPAWNX = obj2.x;
           this.SPAWNY = obj2.y; 
        });

        this.scoreText = this.add.text(4, 4, "Score: 0", {
            fontSize: "16px",
            color: "#ffffff"
        });

        this.physics.add.overlap(my.sprite.player, this.powergroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.powered.play();
            this.JUMP_VELOCITY = this.JUMP_VELOCITY * 1.5;
            //my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY); // start
            setTimeout(() => {
                this.JUMP_VELOCITY = -400;
                //my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY); // end
            }, 3000);
            //-600
            // this.JUMP_VELOCITY = -600;
            this.SCORE += 5;
            this.scoreText.setText("Score: " + this.SCORE);
        });

        this.physics.add.overlap(my.sprite.player, this.exitgroup, (obj1, obj2) => {
            this.scene.start("winScene", { score: this.SCORE });
        });

        

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            // this.coin_particles.setPosition(obj2.x, obj2.y);
            obj2.destroy(); // remove coin on overlap
            // this.coin_particles.start();
            this.SCORE += 1;
            this.scoreText.setText("Score: " + this.SCORE);
            this.coin_touched.play()
        });

        // PLAYER CAMERA
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        // this.cameras.main.setBounds(0,0,game.config.width*2, game.config.height*2); THIS WORKS
        this.cameras.main.setBounds(0,0,1440, 350); // working
        // this.physics.world.setBounds(0,0,this.map.widthInPixels * 0.67,this.map.heightInPixels * 0.67);
        // this.cameras.main.setBounds(0,0,this.map.widthInPixels * 0.67,this.map.heightInPixels * 0.67);
        // this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        // this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        // this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setFollowOffset(0,0);
        this.cameras.main.setDeadzone(25, 25);
        this.cameras.main.setZoom(3);
        // console.log(this.scoreText);

        // this.scoreText.setScale(1 / this.cameras.main.zoom);


        // fixing invisble wall issue
        // this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //PARTICLES
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_04.png'],
            random: true,
            scale: {start: 0.03, end: 0.1},
            maxAliveParticles: 8,
            lifespan: 350,
            gravityY: -200,
            alpha: {start: 1, end: 0.1}, 
            frequency: 100
        });
        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: "dirt_02.png",
            lifespan: 350,
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
        this.scoreText.setPosition(my.sprite.player.body.x - 25, my.sprite.player.body.y - 75);
        this.liveText.setPosition(my.sprite.player.body.x - 25, my.sprite.player.body.y - 50);

        if(this.LIVES <= 0){
            this.scene.start("loseScene", { score: this.SCORE });
        }
        // console.log("TEXT X:",this.scoreText.x);
        // console.log("PLAYER X:", this.scoreText.x);
        // console.log("TEXT Y:", this.scoreText.x);
        // console.log("PLAYER Y:", this.scoreText.x);
        //console.log("player:",my.sprite.player.body.x,my.sprite.player.body.y,"vel:",my.sprite.player.body.velocity.x,my.sprite.player.body.velocity.y);

        // this coruching section was suggested by chatgpt to fix crouching visual bug
        this.crouching = this.skey.isDown && my.sprite.player.body.blocked.down;
        if (this.crouching) {
            my.sprite.player.body.setOffset(0, -20);
        }
        else {
            my.sprite.player.body.setOffset(0, 0);
        }

        
        // this.scoreText.x = this.cameras.main.scrollX;
        // this.scoreText.y = this.cameras.main.scrollY;
        // this.scoreText.x = this.scoreText.x + this.cameras.main.x;
        // this.scoreText.y = this.scoreText.y + this.cameras.main.y;

        

        // PLAYER MOVEMENT (base structure from platformer section assignment)
        if (this.akey.isDown && (this.hit == false)){
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
        else if (this.dkey.isDown && (this.hit == false)){
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
        else if (this.skey.isDown && (this.hit == false)){
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

        // wall jump code suggested by chatgpt
        this.walljump = ((my.sprite.player.body.blocked.left || my.sprite.player.body.blocked.right) && !my.sprite.player.body.blocked.down);
        // if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.spacekey)) {
        //     // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
        //     my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        // }
        if (Phaser.Input.Keyboard.JustDown(this.spacekey) && (this.hit == false)){
            if (!this.walljump && this.jumps < 2){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jumps += 1;
                my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2, false);
                // my.vfx.jump.start();
                my.vfx.jump.explode(2, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2);
                this.jump_sound.play();
            }
            else if (this.walljump){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

                if (my.sprite.player.body.blocked.left){
                    my.sprite.player.body.setVelocityX(400);
                }
                else if (my.sprite.player.body.blocked.right){
                    my.sprite.player.body.setVelocityX(-400);
                }
                this.jumps = 1;
                my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2, false);
                // my.vfx.jump.start();
                my.vfx.jump.explode(2, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2);
                this.jump_sound.play();
            }

            
        }
    }
}