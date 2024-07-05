// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {

    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangulo: { points: 10, count: 0 },
      cuadrado: { points: 20, count: 0 },
      diamante: { points: 30, count: 0 },
      bomba: { points: -10, count: 0 },
    };
  }

  preload() {
    //precargar assets

    //cargar Cielo
    this.load.image("cielo", "./public/assets/Cielo.webp");

    //cargar plataforma
    this.load.image("plataforma", "./public/assets/platform.png");

    //cargar personaje
    this.load.image("personaje", "./public/assets/Ninja.png");

    //cargar recolectable
    this.load.image("triangulo", "./public/assets/triangle.png");
    this.load.image("cuadrado", "./public/assets/square.png");
    this.load.image("diamante", "./public/assets/diamond.png");
    this.load.image("bomba", "./public/assets/bomba.png");

  }


  create() {
    //crear elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    //crear grupa plataformas
    this.plataformas = this.physics.add.staticGroup();
    //al grupo de plataformas agregar una plataforma
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    
    //agregamos otra plataforma en otro lugar
    this.plataformas.create(200, 400, "plataforma");

    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);
 
    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //crear grupo recolectables
    this.recolectables = this.physics.add.group();

    //1º evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //añadir tecla r
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // 2º evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTimer,
      callbackScope: this,
      loop: true,
    });

    //temporizador
    this.timerText = this.add.text(10, 10, `tiempo restante: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    //puntos
    this.scoreText = this.add.text(
      10,
      50,
    `Puntaje: ${this.score}
        T: ${this.shapes["triangulo"].count}
        S: ${this.shapes["cuadrado"].count}
        D: ${this.shapes["diamante"].count}` 
    );

    //agregar collider entre recolectables y personaje
    this.physics.add.collider(
      this.personaje,
      this.recolectables,
      this.onShapeCollect,
      null,
      this
    );

    //agregar collider entre recolectables y plataformas
    this.physics.add.collider(
      this.recolectables,
      this.plataformas,
      this.onRecolectableBounced,
      null,
      this
    );
  }
  
  onSecond() {
    if (this.gameOver) {
        return;
    }
    
    // Crear recolectable
    const tipos = ["triangulo", "cuadrado", "diamante", "bomba"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
        Phaser.Math.Between(10, 790),
        0,
        tipo
    );

    let scale = 0.7; // Escala por defecto para todos los recolectables

    if (tipo === "bomba") {
        scale = 0.2; // Escala específica para la bomba
    }

    recolectable.setScale(scale); // Aplicar escala aquí

    recolectable.setVelocity(0, 100);

    // Rebote
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);
    recolectable.setBounce(rebote);

    // Asignar puntos
    recolectable.setData("points", this.shapes[tipo].points);
    recolectable.setData("tipo", tipo);
}

  update() {
    if (this.gameOver && this.r.isDown) {
      this.scene.restart();
    }
    if (this.gameOver) {
      this.physics.pause();
      this.timerText.setText("Loser");
      return;
    }
    
    // movimiento personaje
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-200);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(200);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-360);
    }
  }

  
  onShapeCollect(personaje, recolectable) {
    const nombreFig = recolectable.getData("tipo");
    const points = recolectable.getData("points");

    this.score += points;

    this.shapes[nombreFig].count += 1;

    console.table(this.shapes);
    console.log("recolectado ", recolectable.texture.key, points);
    console.log("score ", this.score);
    recolectable.destroy();

    this.scoreText.setText(
      `Puntaje: ${this.score}
        T: ${this.shapes["triangulo"].count}
        S: ${this.shapes["cuadrado"].count}
        D: ${this.shapes["diamante"].count}`
    );

    this.checkWin();
  }

  checkWin() {
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras =
      this.shapes["triangulo"].count >= 2 &&
      this.shapes["cuadrado"].count >= 2 &&
      this.shapes["diamante"].count >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Winner");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onRecolectableBounced(recolectable, plataforma) {
    console.log("recolectable rebote");
    let points = recolectable.getData("points");
    points -= 5;
    recolectable.setData("points", points);
    if (points <= 0) {
      recolectable.destroy();
    }
  }
}