export default class End extends Phaser.Scene {
    constructor() {
      super("end");
    }
    init(data) {
      console.log(data)
      this.score = data.score || 0;
      this.gameOver = data.gameOver || null;
    }
    
    create() {
      this.add
        .text(400, 300, this.gameOver ? "Loser" : "Winner", {
          fontSize: "40px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      this.add.text(400, 350, `Score: ${this.score}`);
      this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
  
    update() {
      if (this.r.isDown) {
        this.scene.start("main");
      }
    }
  }