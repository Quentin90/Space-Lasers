//document.onkeydown = checkKey;

// VARIABLES GLOBALES POUR L'AUDIO
var audio;
var audio1,audio2;
audio = new Audio('audio.mp3');
audio.loop=true;
audio.play();


//TAUX D'APPARITION DES LASERS
var spawnRate=6;

//ELEMENTS DU JEU, LISTE DES LASERS A L'ECRAN ET DES SHIELDS
var cursorX,cursorY;
var lasers=new Array();
var shields=new Array();
var actualMusic="audio.mp3";
var basicText;

var touchable=true;//true si le ship peut etre touché par des lasers

//CHRONO
var centi=0 // initialise les dixtièmes
var secon=0 //initialise les secondes
var minu=0 //initialise les minutes
var vitesse=10;
var idMusic=0;
var listZic=new Array();
listZic.push("audio.mp3","feel_good.mp3");



function chrono(){
    centi++; //incrémentation des dixièmes de 1
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

function init() {

    //CREER LE CANVAS DU JEU
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

    //AJOUTE LE BACKGROUND DU DESSUS
    var farTexture = PIXI.Texture.fromImage("resources/bg-far.png");


    far = new PIXI.extras.TilingSprite(farTexture, 512, 256);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;        stage.removeChild(audio2);

    far.tilePosition.y = 0;

    stage.addChild(far);

    //AJOUTE LE BACKGROUND DU DESSOUS
    var midTexture = PIXI.Texture.fromImage("resources/bg-mid.png");
    mid = new PIXI.extras.TilingSprite(midTexture, 512, 256);
    mid.position.x = 0;
    mid.position.y = 128;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    stage.addChild(mid);

    //AJOUTE LE BOUTTON JOUER
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
        stage.removeChild(audio1);
        stage.removeChild(audio2);
        stage.removeChild(choice);
        stage.removeChild(basicText);





    };

    stage.addChild(Bla);



    //AJOUTE LE BOUTTON POUR CHANGER DE MUSIQUE
    var shipTexture = PIXI.Texture.fromImage("resources/choice.png");
    choice = new PIXI.extras.TilingSprite(shipTexture, 160, 40);
    choice.position.x = 40;
    choice.position.y = 0;

    choice.interactive = true;
    choice.mousedown = function(e){
        changeIdMusic();
        playMusique();
        getData();
    };

    stage.addChild(choice);

    //TEXTE DU BOUTON POUR LES ZIKS
    var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 13,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#ffaa00'], // gradient
        stroke: '#d10000',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });
    basicText = new PIXI.Text(actualMusic, style);
    basicText.x = 75;
    basicText.y = 7;
    stage.addChild(basicText);

    //ACTIVER DESACTIVER LA MUSIQUE
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

function changeIdMusic(){
    if(idMusic==0) {
        idMusic = idMusic + 1
    }
    else{
        idMusic=0;
    }
}
function playMusique(){
    var txt=listZic[idMusic];
    console.log(txt);
    actualMusic=txt;
    stage.removeChild(basicText);
    var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 13,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#ffaa00'], // gradient
        stroke: '#d10000',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    });
    basicText = new PIXI.Text(actualMusic, style);
    basicText.x = 70;
    basicText.y = 7;
    stage.addChild(basicText);

    audio.src=txt;
    audio.loop=true;
    audio.play();
}
function audioOn(){
    audio = new Audio(actualMusic);
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
//CREER ET AFFICHE LE VAISSEAU
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
    randomLaser(); // CREER LASER
    mooveLaser(); // BOUGE LASER
    randombuff(); // CREER SHIELDS
    mooveShield(); // BOUGE SHIELDS


    //Move the cat 1 pixel per frame
    //ship.x += 1;

    //Render the stage
    renderer.render(stage);
}

function speedUP(){
    vitesse=vitesse+5; // AUGMENTE LA VITESSE DU JEU
}
function randombuff(){
    var y=Math.random()*512;
    var x=Math.random()*1000;
    if(x<2) {
        //console.log("creer");
        var lasertex = PIXI.Texture.fromImage("resources/shield.png");
        laser = new PIXI.extras.TilingSprite(lasertex, 8, 8);
        laser.position.x = 499;
        laser.position.y = y;
        laser.tilePosition.x = 499;
        laser.tilePosition.y = y;
        laser.speed = Math.floor(Math.random() * vitesse) + 1;
        stage.addChild(laser);
        shields.push(laser);
        console.log(shields);
        //console.log(lasers)
    }
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

function mooveShield(){
    for (var i = 0; i < shields.length; i++) {
        var laserM=shields[i];
        if(laserM.position.x<0){
            shields.splice(i,1);
            stage.removeChild(laserM)
        }else {
            laserM.position.x -= laserM.speed;
        }
        if(touchable) {
            if (laserM.position.x < ship.position.x + 43 && laserM.position.x > ship.position.x + 5 && laserM.position.y < ship.position.y + 33 && laserM.position.y > ship.position.y + 5) {
                //if (laserM.position.y < ship.position.y && laserM.position.y > ship.position.y-20) {
                stage.removeChild(laserM);
                untouchable();

                //}
            }
        }
        //console.log(laserM);
    }
}

function getData(){
    var client = new XMLHttpRequest();
    client.open('GET', 'Scores.txt');
    client.onreadystatechange = function() {
       console.log("tst");
    }
    client.send();
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

            if (laserM.position.x < ship.position.x + 43 && laserM.position.x > ship.position.x + 5 && laserM.position.y < ship.position.y + 33 && laserM.position.y > ship.position.y + 5) {
                //if (laserM.position.y < ship.position.y && laserM.position.y > ship.position.y-20) {
                if(touchable) {
                    x = 10;
                    setTimeout(function () {
                        //do what you need here
                        var birdSound = new Audio('boom.mp3');
                        birdSound.loop = false;
                        birdSound.play();
                        alert("destroyed ! ");
                        location.reload();
                        x += 2000;

                    }, x);


                    //}
                }
                else{
                    stage.removeChild(laserM);
                }
            }

        //console.log(laserM);
    }
}

//RENDS LE VAISSEAU INTOUCHABLE PAR LES LASERS
function untouchable(){
    touchable=false;
    setTimeout(function(){
        touchable=true;
    }, 4500);
}


//FAIT BOUGER LES BACKGROUNDS
function update() {
    far.tilePosition.x -= 0.128;
    mid.tilePosition.x -= 0.64;
    renderer.render(stage);

    requestAnimationFrame(update);
}

//je sais plus a quoi ça sert mais je touche pas mdrrr
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