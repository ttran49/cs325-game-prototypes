var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('asteroid', 'assets/asteroid.png');
    game.load.image('player', 'assets/player.png');
    game.load.spritesheet('explode', 'assets/explode.png', 128, 128);
    game.load.image('starfield', 'assets/starfield.png');

}

var player;
var asteroid;
var background;
var bullets;
var explosions;
var cursors;
var win;
var fireButton;
var firing=0;
var hit=0;

function create(){
	
	//make the game
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//background
	background = game.add.tileSprite(0, 0, 800, 600, 'starfield');
	
	//player
	player= game.add.sprite(400,500,'player');
	player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
	
	//asteroid
	asteroid = game.add.sprite(200,50,'asteroid');
	asteroid.anchor.setTo(0.5, 0.5);
	asteroid.enableBody = true;
    game.physics.enable(asteroid, Phaser.Physics.ARCADE);
	//moving using tween
	var tween = game.add.tween(asteroid).to( { x: 300 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
	//making the asteroid moves down
	tween.onLoop.add(function(){ asteroid.y+=30; }, this);
	
	//bulletssss
	bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
	
	//  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(10, 'explode');
    explosions.killOnComplete = true;
    explosions.forEach(function(asteroid){
		asteroid.anchor.x = 0.5;
		asteroid.anchor.y = 0.5;
		asteroid.animations.add('kaboom');
	}, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	//text for winning
    win = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    win.anchor.setTo(0.5, 0.5);
    win.visible = false;
}

function update(){
	//make the background moves
	background.tilePosition.y += 2;
	
	//moving the player
	if (cursors.left.isDown)
	{
		player.body.velocity.x = -200;
	}
	else if (cursors.right.isDown)
	{
		player.body.velocity.x = 200;
	}
	
	//shooting
	 if (fireButton.isDown)
	{
		if (game.time.now > firing)
		{
			//  Grab the first bullet we can from the pool
			bullet = bullets.getFirstExists(false);

			if (bullet)
			{
				bullet.reset(player.x, player.y + 8);
				bullet.body.velocity.y = -400;
				firing = game.time.now + 200;
			}
		}
	}
	
	//hitting the asteroid
	game.physics.arcade.overlap(bullets, asteroid, hitting, null, this);   //when hit the asteroid call hitting 
}

function render (){
	
}

//handling the bulets hitting the asteroid
function hitting (bullet, asteroid) {  
	if (asteroid.alive==false){
		bullet.kill();
		asteroid.kill();
        asteroid.alive=false;
		
		//win
		win.text="YOU WIN!";
		win.visible=true;
	}

	bullet.kill();
    asteroid.alive=true;    
    hit++;
	
	//boom
	var explosion = explosions.getFirstExists(false);
    explosion.reset(asteroid.body.x, asteroid.body.y);
    explosion.play('explode', 30, false, true);
    
}
