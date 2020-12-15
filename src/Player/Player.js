

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene,x,y,'goblinrun');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0,0);
        // this.setCollideWorldBounds(true);
        // this.body.onWorldBounds = true
        
    
       

    }


    preload(){

    }
    
    create() {
        
        
    }

    update() {

    }

    
    movePlayer() 
    {

        
       
        
            if (cursors.left.isDown)
            {
                player.setVelocityX(-160);
        
                player.anims.play('left', true);
                player.flipX = true;
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(160);
        
                player.anims.play('right', true);
                player.flipX = false;
            }
            else
            {
                player.setVelocityX(0);
        
                player.anims.play('goblinidle',true);
            }
        
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.setVelocityY(-550);
                

            }
    }

    
}