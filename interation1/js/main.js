var game = new Phaser.Game(1300, 1400, Phaser.CANVAS, 'game', { preload: preload, create: create});
function preload(){
    game.load.image('player', 'assets/youknow.png');
    game.load.image('mouse', 'assets/mouse.png');
    game.load.tilemap('tilemap', 'tilemap/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    
    //load pngs for tilemap -- A LOT FK
    //others
    game.load.image('box', 'assets/tiles/boxExplosive.png');
    game.load.image('bridge', 'assets/tiles/bridgeLogs.png');
    
    //door
    game.load.image('door1', 'assets/tiles/door_openMid.png');
    game.load.image('door2', 'assets/tiles/door_openTop.png');
    
    //water
    game.load.image('water1', 'assets/tiles/liquidWater.png');
    game.load.image('water2', 'assets/tiles/liquidWaterTop.png');
    
    //lava
    game.load.image('lava1', 'assets/tiles/liquidLava.png');
    game.load.image('lava2', 'assets/tiles/liquidLavaTop.png');
    
    //grass
    game.load.image('grass1', 'assets/tiles/grass.png');
    game.load.image('grass2', 'assets/tiles/grassCenter.png');
    game.load.image('grass3', 'assets/tiles/grassCliffLeft.png');
    game.load.image('grass4', 'assets/tiles/grassCliffRight.png');
    game.load.image('grass5', 'assets/tiles/grassHillLeft.png');
    game.load.image('grass6', 'assets/tiles/grassHillRight.png');
    
    //stone
    game.load.image('stone1', 'assets/tiles/rockHillLeft.png');
    game.load.image('stone2', 'assets/tiles/rockHillRight.png');
    game.load.image('stone3', 'assets/tiles/stone.png');
    game.load.image('stone4', 'assets/tiles/stoneCenter.png');
    game.load.image('stone5', 'assets/tiles/stoneCliffRight.png');
    
    //castle
    game.load.image('castle1', 'assets/tiles/castleCenter_rounded.png');
    game.load.image('castle2', 'assets/tiles/castleHillLeft.png');
    game.load.image('castle3', 'assets/tiles/castleHillRight.png');
    game.load.image('castle4', 'assets/tiles/castleMid.png');
    
    //dirt
    game.load.image('dirt1', 'assets/tiles/dirtCenter.png');
    game.load.image('dirt2', 'assets/tiles/dirtHillLeft.png');
    game.load.image('dirt3', 'assets/tiles/dirtLeft.png');
    
    //signs
    game.load.image('sign1', 'assets/tiles/signExit.png');
    game.load.image('sign2', 'assets/tiles/signRight.png');
}

var player;
var map;
var ground;
var background;
var death;
var victory;
var spring;
var mouse;


function create() {    
    //game
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = 150;
    game.physics.p2.restitution = 0.7;
    
    
    //tilemap
    map= game.add.tilemap('tilemap');
    
    //tile map set images GOOD
    map.addTilesetImage('box', 'box');
    map.addTilesetImage('bridge', 'bridge');
    
    //grass GOOD
    map.addTilesetImage('grass', 'grass1');
    map.addTilesetImage('grass1', 'grass2');
    map.addTilesetImage('grass2', 'grass3');
    map.addTilesetImage('grass3', 'grass4');
    map.addTilesetImage('grass4', 'grass5');
    map.addTilesetImage('grass5', 'grass6');
    
    //water GOOD
    map.addTilesetImage('water', 'water1');
    map.addTilesetImage('water2', 'water2');
    
    //lava  GOOD
    map.addTilesetImage('lava', 'lava1');
    map.addTilesetImage('lava2', 'lava2');
    
    //ice STONE GOOD
    map.addTilesetImage('ice', 'stone3');
    map.addTilesetImage('ice2', 'stone4');
    map.addTilesetImage('ice3', 'stone1');
    map.addTilesetImage('ice4', 'stone2');
    map.addTilesetImage('ice5', 'stone5');
    
    //stone CASTLE GOOD
    map.addTilesetImage('stone', 'castle1');
    map.addTilesetImage('stone2', 'castle2');
    map.addTilesetImage('stone3', 'castle3');
    map.addTilesetImage('stone4', 'castle4');
    
    //dirt good
    map.addTilesetImage('dirt', 'dirt1');
    map.addTilesetImage('dirt2', 'dirt2');
    map.addTilesetImage('dirt3', 'dirt3');
    
    //door good
    map.addTilesetImage('door', 'door1');
    map.addTilesetImage('door2', 'door2');
    
    //signs GOOD
    map.addTilesetImage('sign', 'sign2');
    map.addTilesetImage('sign2', 'sign1');
    
    
    //iniated all the tilemap variables
    ground= map.createLayer('ground');
    background = map.createLayer('backgroud');
    death = map.createLayer('death');
    victory = map.createLayer('victory');
    
    ground.resizeWorld();
    
    //player
    player= game.add.sprite(150, 400, 'player');
    game.physics.p2.enable(player, true);
    game.camera.follow(player);
    
    //cursor body for spring
    mouse = game.add.sprite(100, 100, 'mouse');
    game.physics.p2.enable(mouse, true);
    mouse.body.static = true;
    mouse.body.data.shapes[0].sensor = true;
    
    //collision stuff. MY GOD, IM SO DONE WITH THIS
    map.setCollisionBetween(0,100,true,'ground');
    game.physics.p2.convertTilemap(map, ground);
    //game.physics.p2.setBoundsToWorld(true, true, true, true, false);
    
    game.input.onDown.add(down, this);
    game.input.onUp.add(gogogo, this);
    game.input.addMoveCallback(updateMouse, this);
}

function down(pointer) {

    var test = game.physics.p2.hitTest(pointer.position, [ player.body ]);
    
    if (test.length)
    {
        spring = game.physics.p2.createSpring(mouse,test[0], 0, 30, 1);
        
    }

}
function updateMouse(pointer, x, y, isDown) {

    //move mouse body to cursor
    if (player.body.x / mouse.body.x >= 1){
        mouse.body.x = mouse.body.x * (player.body.x / mouse.body.x);
    }
    else {
        mouse.body.x = x;
    }
    mouse.body.y = y;

}

function gogogo() {

    game.physics.p2.removeSpring(spring);
}