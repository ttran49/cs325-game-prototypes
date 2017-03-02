var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
function preload(){
    game.load.spritesheet('buttonLeft', 'assets/left-button.png', 193, 71);
    game.load.spritesheet('buttonRight', 'assets/right-button.png', 193, 71);
    game.load.image('ball', 'assets/ball.png');
    game.load.image('thing','assets/spongebob.jpg');
    game.load.audio('lit', ['assets/LIT/ShootinStars.mp3', 'assets/LIT/ShootinStars.ogg']);
}

var leftButton;
var rightButton;
var ball;
var bound;
var scoreText;
var score=0;
var endGameText;
var object;
var thingCollide;
var ballCollide;
var lit;

function create() {    
    //physics for game
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 300;
    game.physics.p2.restitution = 0.9;
    game.physics.p2.setImpactEvents(true);
    
    //LIT
    lit=new Phaser.Sound(game,'lit',1,true);
    setTimeout(function(){ lit.play(); }, 1000);
    
    //collision variable declare
    ballCollide=game.physics.p2.createCollisionGroup();
    thingCollide=game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();
    
    //balls stuffs
    ball=game.add.sprite(game.world.centerX+50, game.world.height - 150, 'ball');
    game.physics.p2.enable(ball);
    ball.body.fixedRotation = true;
    ball.body.setCollisionGroup(ballCollide);
    //if collides call handler
    ball.body.collides(thingCollide, handler, this);
    
    //spawning things
    object= game.add.group();
    object.enableBody = true;
    object.physicsBodyType = Phaser.Physics.P2JS;
    
    for (var i =0; i<4; i++){
        var thingzz= object.create(game.world.randomX, 0 , 'thing');
        thingzz.body.setRectangle(35,35);
        thingzz.body.setCollisionGroup(thingCollide);
        thingzz.body.collides(ballCollide, hittingThing, this);
    }
    
    //buttons
    leftButton = game.add.button(0, game.world.height - 64, 'buttonLeft', leftclick, this, 2, 1, 0);
    rightButton = game.add.button(195, game.world.height - 64, 'buttonRight', rightclick, this, 2, 1, 0);
    
    //end game text
    endGameText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    endGameText.anchor.setTo(0.5, 0.5);
    endGameText.visible = false;
    
    //score text
    scoreText= game.add.text(5, 5,' ', { font: '20px Arial', fill: '#fff' });
    scoreText.text='Score: '+score;
}

function update() {

    //update score
    scoreText.text='Score: '+ score;
    
}

function handler(theBall, theThing){
    theThing.sprite.kill();
    
    score+=10;
    
    var thingzz= object.create(game.world.randomX, 0, 'thing');
    thingzz.body.setRectangle(35,35);
    thingzz.body.setCollisionGroup(thingCollide);
    thingzz.body.collides(ballCollide);
}

function hittingThing(thing1,thing2){
    thing1.sprite.kill();
    
}

function leftclick(){
    ball.body.velocity.x = -180;
    ball.body.velocity.y = -130;
}

function rightclick(){
    ball.body.velocity.x = 180;
    ball.body.velocity.y = -130;
}