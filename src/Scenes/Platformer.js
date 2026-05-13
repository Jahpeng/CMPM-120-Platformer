class Sewage_Zone extends Phaser.Scene {
    constructor(){
        super("sewage_zone");
    }

    // Basic structure copied from Professor's lectures
    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;
    }

    preload(){}

    create(){}

    update(){}
}