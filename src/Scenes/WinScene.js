class WinScene extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    init(data){
        this.finalScore = (data.score) || 0;
    }
    preload(){}

    create(){
        this.add.text(800, 180, "LEVEL COMPLETE!", {
            fontSize: "64px",
            color: "#00ff80"
        }).setOrigin(0.5);

        this.add.text(800, 260, "FINAL SCORE", {
            fontSize: "28px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(800, 310, this.finalScore, {
            fontSize: "48px",
            color: "#ffa500"
        }).setOrigin(0.5);

        let restart = this.add.text(800, 420, "BACK TO TITLE", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        restart.setInteractive({ useHandCursor: true });

        restart.on("pointerover", () => {
            restart.setStyle({ color: "#ffff00" });
        });

        restart.on("pointerout", () => {
            restart.setStyle({ color: "#00ff00" });
        });

        restart.on("pointerdown", () => {
            this.scene.stop("sewage_zone");
            this.scene.start("titleScene");
        });

    }

    update(){}

}