var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('canonleft', 'assets/canonleft.png');
    game.load.image('canonright', 'assets/canonright.png');
    game.load.image('ship', 'assets/ship.png');
    game.load.image('victim', 'assets/victim.png');
    game.load.image('bullet', 'assets/bullet.png');
}

var canon1;
var canon2;
var canon3;
var canon4;
var canon5;
var canon6;
var player;
var score=0;
var victims;
var timeText;
var scoreText;
var secondCount=0;
var fireRate = 100;
var nextFire = 0;
var bullets;
var speed = 450;
var endGameText;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#363636';
    
    //player
    player= game.add.sprite(450, 700, 'ship');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    canon2 = game.add.sprite(30, 400, 'canonleft');
    canon2.anchor.setTo(0.4, 0.9);

    canon3 = game.add.sprite(30, 650, 'canonleft');
    canon3.anchor.setTo(0.4, 0.9);
    
    //right side    
    canon5 = game.add.sprite(970, 400, 'canonright');
    canon5.anchor.setTo(0.3, 0);
    
    canon6 = game.add.sprite(970, 650, 'canonright');
    canon6.anchor.setTo(0.3, 0);
    
    //spawn victims
    victims = game.add.group();
    victims.enableBody = true;
    for (var i = 0; i < 4; i++)
    {
         var victim = victims.create(game.rnd.between(150, 700), 0, 'victim');
         victim.body.velocity.y = game.rnd.between(50, 150);
         victim.outOfBoundsKill = true;
    }
    
    timeText= game.add.text(5, 5, 'Time: 0 Seconds');
    scoreText=game.add.text(5, 35, 'Victims saved: 0');
    
    //bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(7, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    
    //time 
    game.time.events.loop(Phaser.Timer.SECOND, timerUpdate, this);
    
    //end game text
    endGameText = game.add.text(game.world.centerX,game.world.centerY,' GAME OVER ', { font: '84px Arial', fill: '#fff' });
    endGameText.anchor.setTo(0.5, 0.5);
    endGameText.visible = false;

}

function timerUpdate(){
    secondCount++;
    
    timeText.setText('Time: '+secondCount+" Seconds");
    
    //every 5 secs
    if (secondCount % 3 ==0){
        for (var i = 0; i < (secondCount*0.6); i++)
        {
            var victim = victims.create(game.rnd.between(150, 700), 0, 'victim');
            victim.body.velocity.y = game.rnd.between(50, 150);
            victim.outOfBoundsKill = true;
        }
    }
}

function shoot2()
{
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(canon2.x - 8, canon2.y - 8);
        

        game.physics.arcade.moveToPointer(bullet, 200);
    }
}
function shoot3()
{
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(canon3.x - 8, canon3.y - 8);
        

        game.physics.arcade.moveToPointer(bullet, 300);
    }
}
function shoot5()
{
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(canon5.x - 8, canon5.y - 8);
        

        game.physics.arcade.moveToPointer(bullet, 400);
    }
}
function shoot6()
{
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(canon6.x - 8, canon6.y - 8);
        

        game.physics.arcade.moveToPointer(bullet, 500);
    }
}

function save(hero, vic)
{
    score++;
    vic.kill();
    if (speed > 375){
        speed = speed - 5;
    }
}

function hit(hero, bul)
{
    hero.kill();
    endGameText.visible=true;
}

function update() {
    canon2.rotation = game.physics.arcade.angleToPointer(canon2);
    canon3.rotation = game.physics.arcade.angleToPointer(canon3);
    canon5.rotation = game.physics.arcade.angleToPointer(canon5);
    canon6.rotation = game.physics.arcade.angleToPointer(canon6);
    
    game.physics.arcade.collide(player, victims, save, null, this);
    game.physics.arcade.collide(player, bullets, hit, null, this);
    
    //text
    scoreText.setText('Victims saved: ' + score);
    
    //move ship
    if (game.input.mousePointer.isDown)
    {
        game.physics.arcade.moveToPointer(player, speed);
        if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)) {   player.body.velocity.setTo(0, 0);   } 
    }
    else
    {        player.body.velocity.setTo(0, 0);  }
    
    if(secondCount % 2 == 0){
        shoot3();
    }
    else if(secondCount % 3 == 0){
        shoot2();
    }
    else if(secondCount % 4 == 0){
        shoot5();
    }
    else if(secondCount % 5 == 0){
        shoot6();
    }
}

