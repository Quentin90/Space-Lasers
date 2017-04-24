//document.onkeydown = checkKey;
var audio;
var audio1,audio2;
audio = new Audio('audio.mp3');
audio.loop=true;
audio.play();
var spawnRate=6;
var cursorX,cursorY;
var lasers=new Array();

var centi=0 // initialise les dixtièmes
var secon=0 //initialise les secondes
var minu=0 //initialise les minutes
var vitesse=10;


function chrono(){
    centi++; //incrémentation des dixièmes de 1
    console.log(centi,secon,minu);
    if (centi>9){centi=0;secon++} //si les dixièmes > 9,
    if (secon>59){secon=0;minu++} //si les secondes > 59,
    if(secon%17==0 && secon!=0 && centi==0){
        console.log("sppeeeeeeed UP !!");
        speedUP();
    }
    if(secon%20==0 && secon!=0 && centi==0){
        console.log("Density UP !!");
        spawnRate=spawnRate+1;
    }
    compte=setTimeout('chrono()',100) //la fonction est relancée
}

function rasee() { //fonction qui remet les compteurs à 0
    clearTimeout(compte) //arrête la fonction chrono()
    centi = 0;
    secon = 0;
    minu = 0;

}

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
        cursorX = e.pageX;
        cursorY = e.pageY;
    };
    var farTexture = PIXI.Texture.fromImage("resources/bg-far.png");


    far = new PIXI.extras.TilingSprite(farTexture, 512, 256);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;        stage.removeChild(audio2);

    far.tilePosition.y = 0;

    stage.addChild(far);


    var midTexture = PIXI.Texture.fromImage("resources/bg-mid.png");
    mid = new PIXI.extras.TilingSprite(midTexture, 512, 256);
    mid.position.x = 0;
    mid.position.y = 128;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    stage.addChild(mid);

    var shipTexture = PIXI.Texture.fromImage("resources/play.png");
    Bla = new PIXI.extras.TilingSprite(shipTexture, 100, 30);
    Bla.position.x = 210;
    Bla.position.y = 170;

    Bla.interactive = true;
    Bla.mousedown = function(e){
        initShip();
        gameLoop();
        chrono();
        stage.removeChild(Bla);
        if(audio1!=null){
            stage.removeChild(audio1);

        }else {
            stage.removeChild(audio2);
        }



    };

    stage.addChild(Bla);



    var shipTexture = PIXI.Texture.fromImage("resources/sonOff.png");
    audio2 = new PIXI.extras.TilingSprite(shipTexture, 40, 40);
    audio2.position.x = 0;
    audio2.position.y = 0;

    audio2.interactive = true;
    audio2.mousedown = function(e){
        audioOff();


    };

    stage.addChild(audio2);
    requestAnimationFrame(update);


}
function audioOn(){
    audio = new Audio('audio.mp3');
    audio.loop=true;
    audio.play();

    var shipTexture = PIXI.Texture.fromImage("resources/sonOff.png");
    audio2 = new PIXI.extras.TilingSprite(shipTexture, 40, 40);
    audio2.position.x = 0;
    audio2.position.y = 0;

    audio2.interactive = true;
    audio2.mousedown = function(e){
        audioOff();


    };

    stage.addChild(audio2);
    stage.removeChild(audio1);
}
function audioOff(){
    audio.src="";

    var shipTexture = PIXI.Texture.fromImage("resources/sonOn.png");
    audio1 = new PIXI.extras.TilingSprite(shipTexture, 40, 40);
    audio1.position.x = 0;
    audio1.position.y = 0;

    audio1.interactive = true;
    audio1.mousedown = function(e){
        audioOn();


    };

    stage.addChild(audio1);
    stage.removeChild(audio2);


}

function initShip() {
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

function speedUP(){
    vitesse=vitesse+5;
}
function randomLaser(){
    var y=Math.random()*512;
    var x=Math.random()*100;
    if(x<spawnRate) {
        //console.log("creer");
        var lasertex = PIXI.Texture.fromImage("resources/laser.png");
        laser = new PIXI.extras.TilingSprite(lasertex, 17, 5);
        laser.position.x = 499;
        laser.position.y = y;
        laser.tilePosition.x = 499;
        laser.tilePosition.y = y;
        laser.speed = Math.floor(Math.random() * vitesse) + 1;
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
        if(laserM.position.x<ship.position.x+43 && laserM.position.x>ship.position.x+5  && laserM.position.y < ship.position.y+33 && laserM.position.y > ship.position.y+5) {
            //if (laserM.position.y < ship.position.y && laserM.position.y > ship.position.y-20) {
            x=10;
            setTimeout(function(){
                //do what you need here
                var birdSound = new Audio('boom.mp3');
                birdSound.loop = false;
                birdSound.play();
                alert("destroyed ! ");
                location.reload();
                x+=2000;

            }, x);




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