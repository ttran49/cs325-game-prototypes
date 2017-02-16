window.onload = function() {
"use strict";

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('pony', 'assets/pony.png');
    game.load.image('love','assets/love.png');
    game.load.image('bullet','assets/heart.png');
    game.load.image('ground','assets/ground.png');
}

var player;
var platforms;
var hearts;
var fireRate=20;
var nextFire=0;
var bullets;
var cursors;
var score=0;
var mark;
var loveCounter=0;
var loveText;
    
function create() {
    
    game.stage.backgroundColor = '#ff80df';
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'pony');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    hearts = game.add.group();
    hearts.enableBody = true;
    for (var i = 0; i < 6; i++){
        var heart = hearts.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y = Math.random() * 50;
    }
    
    loveText = game.add.text(0, 16, 'Love <3: 0', { fontSize: '32px', fill: '#000' });
    mark = game.add.text(200, 16, '', { fill: '#ffa31a' });
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.arcade.collide(player, platforms);
    //hearts hit the ground
    game.physics.arcade.collide(platforms, hearts, hitGround, null, this);
    //bullet hit hearts
    game.physics.arcade.overlap(bullets, hearts, hitLove, null, this);

    if(game.input.activePointer.leftButton.isDown){
        if(game.input.mousePointer.x >= player.x && game.input.mousePointer.x <= (player.x+70) &&
           game.input.mousePointer.y >= player.y && game.input.mousePointer.y <= (player.y+70)){
            lovemark();
        }
        fire();
    }
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;  
    }


}

function fire() {
    if (game.time.now > nextFire && bullets.countDead() > 0) {

        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(player.x - 8, player.y - 8);
        game.physics.arcade.moveToPointer(bullet, 1000);
    }
}
    
function hitGround(ground, heart){
    heart.kill();
    //kill then spawn more
    for (var i =0; i<2;i++){
        var heart=hearts.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y=40;
    }
}
function hitLove(projectile,target){
    //destroy then spawn more
    target.kill();
    projectile.kill();
    for (var i=0;i<1;i++){
        var heart=hearts.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y=40;
    }
    score+=1;
    loveText.text= 'Love <3: '+score;
}
function lovemark(){
    loveCounter++;
    mark.text= "I see you! You have clicked on me " +loveCounter+" times! <3<3";
}
}