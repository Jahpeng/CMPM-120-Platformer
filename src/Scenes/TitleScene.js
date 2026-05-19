class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    init(){}

    preload(){}

    create(){
        this.add.text(600, 180, "Construction Site Frolic", {
            fontSize: "64px",
            color: "#a200ff"
        }).setOrigin(0.5);

        let start = this.add.text(700, 420, "START GAME", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        start.setInteractive({ useHandCursor: true });

        start.on("pointerover", () => {
            start.setStyle({ color: "#ffff00" });
        });

        start.on("pointerout", () => {
            start.setStyle({ color: "#00ff00" });
        });

        start.on("pointerdown", () => {
            this.scene.stop("loadScene");
            this.scene.start("loadScene");
        });


        let control = this.add.text(700, 520, "CONTROLS", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        control.setInteractive({ useHandCursor: true });

        control.on("pointerover", () => {
            control.setStyle({ color: "#ffff00" });
        });

        control.on("pointerout", () => {
            control.setStyle({ color: "#00ff00" });
        });

        control.on("pointerdown", () => {
            // this.scene.stop("GameScene");
            this.scene.start("controlsScene");
        });


        let credits = this.add.text(700, 620, "CREDITS", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        credits.setInteractive({ useHandCursor: true });

        credits.on("pointerover", () => {
            credits.setStyle({ color: "#ffff00" });
        });

        credits.on("pointerout", () => {
            credits.setStyle({ color: "#00ff00" });
        });

        credits.on("pointerdown", () => {
            // this.scene.stop("GameScene");
            this.scene.start("creditsScene");
        });


    }

    update(time, delta){}
}