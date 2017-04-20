//document.onkeydown = checkKey;

var audio = new Audio('audio.mp3');
audio.play();
var cursorX,cursorY;
var lasers=new Array();
var map = {38: false, 40: false, 37: false,39:false};
$(document).keydown(function(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[38] && map[37]) {
            // FIRE EVENT
            ship.y-=1;
            ship.x-=1;

        }
        if (map[38] && map[39]) {
            // FIRE EVENT
            ship.y-=1;
            ship.x+=1;
        }
        if (map[40] && map[37]) {
            // FIRE EVENT
            ship.y+=1;
            ship.x-=1;
        }
        if (map[40] && map[39]) {
            // FIRE EVENT
            ship.y+=1;
            ship.x+=1;
        }
        if (map[40]) {
            // FIRE EVENT
            ship.y+=2;

        }
        if (map[37]) {
            // FIRE EVENT
            ship.x-=2;

        }
        if (map[39]) {
            // FIRE EVENT
            ship.x+=2;

        }
        if (map[38]) {
            // FIRE E-ENT
            ship.y-=2;

        }
    }
}).keyup(function(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = false;
    }
});


function init() {


    stage = new PIXI.Container();
    renderer = PIXI.autoDetectRenderer(
        512,
        384,
        {view:document.getElementById("game-canvas")}
    );
    renderer.view.onmousemove = function(e){
        console.log(e.pageX,e.pageY);
        cursorX = e.pageX;
        cursorY = e.pageY;
    };
    var farTexture = PIXI.Texture.fromImage("resources/bg-far.png");


    far = new PIXI.extras.TilingSprite(farTexture, 512, 256);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;

    stage.addChild(far);


    var midTexture = PIXI.Texture.fromImage("resources/bg-mid.png");
    mid = new PIXI.extras.TilingSprite(midTexture, 512, 256);
    mid.position.x = 0;
    mid.position.y = 128;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    stage.addChild(mid);

    var shipTexture = PIXI.Texture.fromImage("resources/ship.png");
    ship = new PIXI.extras.TilingSprite(shipTexture, 60, 45);
    ship.position.x = 0;
    ship.position.y = 0;
    ship.tilePosition.x = 0;
    ship.tilePosition.y = 0;
    ship.interactive = true;
    ship.mousemove = function(e){
        ship.x=cursorX-Math.floor(((screen.width-512)/2)+30);
        ship.y=cursorY-30;
    };

    stage.addChild(ship);




    gameLoop();
    requestAnimationFrame(update);


}

function gameLoop(){

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);
    randomLaser();
    mooveLaser();


    //Move the cat 1 pixel per frame
    //ship.x += 1;

    //Render the stage
    renderer.render(stage);
}
function randomLaser(){
    var y=Math.random()*512;
    var x=Math.random()*100;
    if(x<6) {
        //console.log("creer");
        var lasertex = PIXI.Texture.fromImage("resources/laser.png");
        laser = new PIXI.extras.TilingSprite(lasertex, 17, 5);
        laser.position.x = 499;
        laser.position.y = y;
        laser.tilePosition.x = 499;
        laser.tilePosition.y = y;
        laser.speed = Math.floor(Math.random() * 10) + 1;
        stage.addChild(laser);
        lasers.push(laser);
        //console.log(lasers)
    }




}
function mooveLaser(){
    for (var i = 0; i < lasers.length; i++) {
        var laserM=lasers[i];
        if(laserM.position.x<0){
            lasers.splice(i,1);
            stage.removeChild(laserM)
        }else {
            laserM.position.x -= laserM.speed;
        }
        console.log(ship.position.x,ship.position.y);
        if(laserM.position.x<ship.position.x+43 && laserM.position.x>ship.position.x+5  && laserM.position.y < ship.position.y+33 && laserM.position.y > ship.position.y+5) {
            //if (laserM.position.y < ship.position.y && laserM.position.y > ship.position.y-20) {
            var birdSound = new Audio('boom.mp3');
            birdSound.loop = false;
            birdSound.play();
            setTimeout(function(){
                console.log("pause");
            }, 200);

            alert("destroyed ! ");
            location.reload();
            //}
        }
        //console.log(laserM);
    }
}

function update() {
    far.tilePosition.x -= 0.128;
    mid.tilePosition.x -= 0.64;
    renderer.render(stage);

    requestAnimationFrame(update);
}


function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}