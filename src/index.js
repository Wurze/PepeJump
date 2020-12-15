
let config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    fps:60,
    backgroundColor: '#4599ff',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: gameOptions.gravity },
      }
    },
    scene: GameScene,
  };
  
  game = new Phaser.Game(config);


