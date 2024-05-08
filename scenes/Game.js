// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
  }

  preload() {
    //cargar assets

    //import cielo
    this.load.image("cielo" , "../public/assets/Cielo.webp" );

    //import plataformas
    this.load.image("plataforma" , "../public/assets/platform.png" );

    //personaje
    this.load.image("personaje" , "../public/assets/Ninja.png");

    //figuras
    this.load.image("triangulo" , "../public/assets/triangle.png");
    this.load.image("rombo" , "../public/assets/diamond.png");
    this.load.image("cuadrado" , "../public/assets/square.png");
  }

  create() {
    //crear elementos

    //crear cielo
    this.cielo = this.add.image(400 , 300, "cielo");
    //escalar cielo al tamaño de la pantalla
    this.cielo.setScale(2);

    //grupo estatico de plataformas
    this.plataformas = this.physics.add.staticGroup();

    this.plataformas.create (400, 580, "plataforma").setScale(2).refreshBody();
    //evitamos estos pasos haciendo el de arriba
    //crear plataforma  
   //this.plataforma = this.add.image(400 , 500, "plataforma");
   //escalar tambien
   //plataforma.setScale(2);

    //agregar otra plataforma
   this.plataformas.create (200, 300, "plataforma");

   //crear personaje
    this.personaje = this.physics.add.sprite (440, 300, "personaje");
    this.personaje.setScale(0.1);
    //choca con el mundo (fin de la pantalla)
    this.personaje.setCollideWorldBounds (true);
    //choca con la plataforma (nuestro mundo)
    this.physics.add.collider (this.personaje, this.plataformas);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //crear grupo de figuras recolectables
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.personaje, this.recolectables);


    //evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond(),
      callbackScope: this,
      loop: true,
    })


  }

  onSecond() {
    //crear recolectable
    const tipos = ["triangulo", "cuadrado", "rombo"]
    const tipo = Phaser.Math.RND.pick(tipos);
    console.log(tipo)
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }




  update() {
    //movimiento personaje
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown){
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }

    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330)
    }



  }
}
