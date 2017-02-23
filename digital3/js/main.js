var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
function preload(){
    game.load.spritesheet('buttonLeft', 'assets/left-button.png', 193, 71);
    game.load.spritesheet('buttonRight', 'assets/right-button.png', 193, 71);
    game.load.spritesheet('buttonDown', 'assets/down-button.png', 193, 71);
    game.load.image('player', 'assets/spongebob.jpg');
    game.load.image('ground', 'assets/ground.png');
}

var leftButton;
var rightButton;
var downButton;
var player;
var platforms;
var text;
var hitable=true;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';
    var ratData = [
        '.D...........',
        '18...........',
        '1D...........',
        '18.....1111..',
        '1D..111DDEE1.',
        '1811EEE18E0E1',
        '.1DEEEEEEEEED',
        '..1EEEEEE41..',
        '.11E41E1411..',
        '1111E1E1E111.',
        '.1111111111..'
    ];
    game.create.texture('ratTexture', ratData, 4, 4, 4);
    
    //rats
    rats = game.add.physicsGroup();
    var y = 80;
    for (var i = 0; i < 30; i++)
    {
        var rat = rats.create(game.world.randomX, y, 'ratTexture');
        rat.body.velocity.x = game.rnd.between(180, 400);
        y += 35;
    }
    
    //ground
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true;
    
    //player
    player = game.add.sprite(350, 20, 'player');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    
    //buttons
    downButton = game.add.button(game.world.centerX-100, game.world.height - 64, 'buttonDown', downclick, this, 2, 1, 0);
    leftButton = game.add.button(game.world.centerX - 195-100, game.world.height - 64, 'buttonLeft', leftclick, this, 2, 1, 0);
    rightButton = game.add.button(game.world.centerX + 195-100, game.world.height - 64, 'buttonRight', rightclick, this, 2, 1, 0);
    
    //text
    text = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    text.anchor.setTo(0.5, 0.5);
    text.visible = false;

}

function update() {
    game.physics.arcade.overlap(player, rats, collisionHandler, null, this);
    game.physics.arcade.collide(player, platforms, hitGround,null,this);
    rats.forEach(checkPos, this);
}

function checkPos (rat) {

    if (rat.x > 800)
    {
        rat.x = -100;
    }

}

function hitGround(player, platforms){
    text.text=" GAME OVER \n Double Click to restart";
    text.visible = true;
    hitable=false;
    game.input.onTap.addOnce(restart,this);
}

function restart(){
    hitable=true;
    text.visible=false;
    player.x = 350;
    player.y=20;
}

function collisionHandler (player, rat) {
    if (hitable){
        player.x = 350;
        player.y=20;
    }
}

//buttons handling functions
function downclick(){
    player.y+=70;
}

function leftclick(){
    player.x-=15;
}

function rightclick(){
    player.x+=15;
}