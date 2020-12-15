

let cursors;
let player;
let stars;
let scoreLabel;
let platforms;
let gameOver = false;
let platformCount;
let bombs;
let gameOptions = {
  width: 480,
  height: 640,
  gravity: 2000
}
 class GameScene extends Phaser.Scene {



    constructor()
{
    super({
       key : 'GameScene'});

       
}

preload() {
  // preloading both run and idle spritesheets of player
  this.load.spritesheet('goblinrun', 
	'assets/goblinrun.png',
  { frameWidth: 205, frameHeight: 300 }
) 

this.load.spritesheet('goblinidle', 
	'assets/goblinidle.png',
  { frameWidth: 210, frameHeight: 300}
) 

this.load.image('star', 'assets/star.png')
this.load.image('bomb','assets/bomb.png')

this.load.image('bg-clouds','assets/bg-clouds.png')
this.load.image('bg-mountains','assets/bg-mountains.png')
this.load.image('bg-trees','assets/bg-trees.png')

//tile

this.load.image('platform', 'assets/platform.png')


  }

  
create() {

  const graphics = this.add.graphics();
  
  graphics.fillGradientStyle(0xdadaff, 0x6cfafa, 0xfccaff, 0xdadaff, 1);
  graphics.fillGradientStyle(0xdadaff, 0x6cfafa, 0xfccaff, 0xdadaff, 1);

  //bg
 
  let bgClouds = this.add.image(0,0, 'bg-clouds').setOrigin(0,0)
  bgClouds.setScale(3);

  // bgClouds.setScrollFactor(0);
  

  let bgMountains = this.add.image (0,0,'bg-mountains').setOrigin(0,0)
  bgMountains.setScale(3);
  // bgMountains.setScrollFactor(-0.1);

  let bgTrees = this.add.image (0,0,'bg-trees').setOrigin(0,0)
  bgTrees.setScale(3.1);
  // bgTrees.setScrollFactor(-0.3);

  
  //platform

  

  this.physics.world.setBounds(0, 0, 480, 640);



    platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      
    });
  

  //create platforms from the group

  for (let i = 0; i < 8; i++) {
    let randomX = Math.floor(Math.random() * 400) + 24;
    platforms.create(randomX, i * 80, 'platform').setScale(0.4);
  }
// /** @type {Phaser.Physics.Arcade.Sprite} */
//     const platform = platforms.create(x,y,'platform')
//     platform.body.setFrictionX = 0;
//     platform.scale = 0.5
//   }
//     /** @type {Phaser.Physics.Arcade.StaticBody} */
//     let body = platform.body
//     body.updateFromGameObject()
//   }

  // input

  cursors = this.input.keyboard.createCursorKeys();

  //scoreLabel
this.scoreLabel = this.createScoreLabel(16,16,0)
  

  //player
  

  player = new Player(this, 240, 320,'goblinrun')
  player.setScale(0.19);
  player.body.setAccelerationY(-1000)
  player.body.checkCollision.up = false
  player.body.checkCollision.left = false
  player.body.checkCollision.right = false
  


  this.cameras.main.shake(100, .004);
  // this.cameras.main.startFollow(player, true, 0.9,0.9)
  // this.cameras.main.setBounds(0,0,1024, 2048,true)
  // this.cameras.main.setZoom();
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('goblinrun', { start: 0, end: 6 }),
    frameRate: 10,
    repeat: -1
    
})

this.anims.create({
    key: 'goblinidle',
    frames: this.anims.generateFrameNumbers('goblinidle',{start:0, end: 2 }),
    frameRate: 6,
    repeat: -1
})

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('goblinrun', { start: 0, end: 6 }),
    frameRate: 10,
    repeat: -1
})

this.anims.create({
  key: "rotate",
  frames: this.anims.generateFrameNumbers("coin", {
      start: 0,
      end: 5
  }),
  frameRate: 15,
  yoyo: true,
  repeat: -1
});

stars = this.physics.add.group({
  key: 'star',
  repeat: 5,
  setXY: { x: 12, y: 0, stepX: 70 }
});

stars.children.iterate(function (child) {

  //  Give each star a slightly different bounce
  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

bombs = this.physics.add.group();


this.physics.add.collider(player,platforms);
this.physics.add.collider(stars, platforms);
this.physics.add.collider(bombs, platforms);


this.physics.add.collider(player, bombs, this.hitBomb, null, this);
this.physics.add.overlap(player, stars, this.collectStar, null, this);
//Score

// this.timer = this.time.addEvent(2000,this.platform,this)

}

update(){
 
  player.movePlayer();
  
  if(player.y > gameOptions.height){
    this.scene.start("GameScene");
}
  if (player.body.y <  gameOptions.height/1.5) {
    platforms.children.iterate(this.updateY, this);
  }
  
}



collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
     this.scoreLabel.add(10)
    // scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 2)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.y, 0, true, true);

        });



        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);


    }
}

createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
  }
  

hitBomb (player, bombs)
{
  this.scene.start("GameScene");

    player.setTint(0xff0000);

    player.anims.play('goblinidle');

    gameOver = true;
}


updateY(platform){
  let delta = Math.floor(gameOptions.height/2) - player.y;  // we want to keep the player somewhere in the center of the screen so we'll measure the difference from the center y

  if(delta > 0){ 
    platform.y += delta/30; //the delta may be too large so I'll make it smaller by dividing it by 30
  }

  if(platform.y > 640){
    platform.y = -platform.height;
    platform.x = Math.floor(Math.random() * 400) + 24;
    platformCount += 1;
  }
}

}






