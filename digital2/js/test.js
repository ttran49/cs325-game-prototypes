var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create });

function preload(){
    game.load.image('pony', 'assets/pony.png');
    game.load.image('love','assets/love.png');
    game.load.image('bullet','assets/heart.png');
    game.load.image('ground','assets/ground.png');
}

var platforms;
var pony;
var love;
var bullet;
var fireRate=100;
var nextFire=0;
var score=0;
var text;

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#4488AA";
    
    //create the ground
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
  
    
    //pony
    pony = game.add.sprite(32, game.world.height - 150, 'pony');
    game.physics.arcade.enable(pony);
    pony.body.gravity.y = 300;
    pony.body.collideWorldBounds = true;

    
    //heart aka love
    love=game.add.group();
    love.enableBody=true;
    
    //spawning hearts
    for (var i=0;i<5;i++){
        var heart=love.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y=40;
    }
    
    //bullet
    bullet = game.add.group();
    bullet.createMultiple(50, 'bullet');
    bullet.setAll('checkWorldBounds', true); 
    bullet.setAll('outOfBoundsKill', true); 
    
    game.input.mouse.capture = true;
    text = game.add.text(15, 10, "Score: 0", { font: "25px Arial" ,align: "left" });
}

function update(){
    //check fire
    if( game.input.activePointer.leftButton.isDown){
        fire();
    }
    
    game.physics.arcade.collide(pony, platforms);
    //heart hit the ground
    game.physics.arcade.collide(gameVar, love, hitGround, null, this);
    //hit the heart
    game.physics.arcade.collide(bullet, love, hitLove);
    
}

function fire() {

    if (game.time.now > nextFire && bullet.countDead() > 0) {

        nextFire = game.time.now + fireRate;
        var bullets = bullet.getFirstDead();
        game.physics.arcade.moveToPointer(bullets, 1000);
    }
}

function hitGround(ground, heart){
    //kill then spawn more
    heart.kill();
    for (var i =0; i<5;i++){
        var heart=love.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y=40;
    }
}
function hitLove(){
    //destroy then spawn more
    love.destroy();
    for (var i=0;i<3;i++){
        var heart=love.create(Math.random() * 800, Math.random(), 'love');
        heart.body.gravity.y=40;
    }
    
    //score
    score+=10;
    text.setText("Score: " + score);
}