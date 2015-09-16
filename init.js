// game attributes
var gameFPS = 30;
var context;
var queue;
var WIDTH = 1280;
var HEIGHT = 800;
var mouseXPosition;
var mouseYPosition;
var stage;
var eInit = Object.freeze( {
    NUM_LIGHTS: 6
});
var numLights = eInit.NUM_LIGHTS;
var numAnglers = 12;

// bools
var qLoaded = false;
var waitForSpace = true;
var beginCollisions = false;
var endscene = false;
var winscene = false;
var lockScene = false;

var nobodySpriteSheet;
// var nobodyDeathSpriteSheet;
// var lightSpriteSheet;
// var anglerSpriteSheet;

// backgrounds + alphas
var menu;
var backgroundBlue;
var backgroundSun;
var backgroundBoss;
var level1;
var level2;
var level3;
var currLevel = 1;

// alphas
var menuAlpha = 0.66;
var backgroundAlpha = 0.50;
var bgBlueAlpha = 0.05;
var bgSunAlpha = 0.15;
var bgBossAlpha = 0.02;
var bgLevel1Alpha = 0.3;
var bgLevel2Alpha = 0.3;
var bgLevel3Alpha = 0.3;
var nobodyAlpha = 0.50;
var lightAlpha = 0.05;
var anglerAlpha = 0.03;
var alphaRange = 0.07;

// rates alpha
var iBossAppearRate = 0.004;
var iSunRate = 0.15;
var iNobodyLightRate = 0.10;
var iScareRate = 0.05;

// animations (really just bitmap sprites)
var animation;
var animationHitbox;
var deathAnimation;
var lightsAnimation = [];
var anglersAnimation = [];

// positions & speeds
var nobodyXPos = 100;
var nobodyYPos = 100;
var nobodyXSpeed = 1.75;
var nobodyYSpeed = 2.25;

var lightsXSpeed = [];
var lightsYSpeed = [];

var anglersXSpeed = [];
var anglersYSpeed = [];

var eSpeeds = Object.freeze( {
    LIGHTS_X: 1.75,
    LIGHTS_Y: 1.5, 
    ANGLERS_X: 3.25, 
    ANGLERS_Y: 2.75});

// bitmap sizes
var eBounds = Object.freeze( {
    LIGHT_WIDTH: 50,
    LIGHT_HEIGHT: 47,
    NOBODY_WIDTH: 100,
    NOBODY_HEIGHT: 122,
    ANGLER_WIDTH: 198,
    ANGLER_HEIGHT: 117
} );

// texts
var score = 0;
var scoreText;
var gameTimer;
var gameTime = 99;
var timerText;
var textColor = "#27d";

// var introText;
// var introCharSize = 7.5;

// keyboard input
var KEYCODE_LEFT = 37, 
    KEYCODE_RIGHT = 39,
    KEYCODE_UP = 38, 
    KEYCODE_DOWN = 40,
    KEYCODE_SPACE = 32,
    KEYCODE_W = 87,
    KEYCODE_L = 76;
    

// depths
var eDepths = Object.freeze({ANGLER: 3, NOBODY: 3, LIGHT: 3});



window.onload = function()
{
    /*
     *      Set up the Canvas with Size and height
     *
     */
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

    /*
     *      Set up the Asset Queue and load sounds
     *
     */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    // createjs.Sound.alternateExtensions = ["ogg"];

    /*
     *      Create a load manifest for all assets
     *
     */
    queue.loadManifest([
    // backgrounds
        {id: "backgroundImage", src: "assets/background.jpg"},
        {id: "backgroundBlue", src: "assets/background_blue.png"},
        {id: "backgroundSun", src: "assets/background_sun.png"},
        {id: "backgroundBoss", src: "assets/boss_background.png"},
        {id: "level1", src: "assets/level1.png"},
        {id: "level2", src: "assets/level2.png"},
        {id: "level3", src: "assets/level3.png"},
    // menus
        {id: "menu", src: "assets/menu.png"},
    // sprites
        {id: 'crossHair', src: 'assets/crosshair.png'},
        {id: 'nobodySpritesheet', src: 'assets/firefly_spritesheet.png'},
        // {id: 'nobodySprite', src: 'assets/nobody.png'},
        {id: 'nobodyDeath', src: 'assets/dead.png'},
        // {id: 'lightSpritesheet', src: 'assets/lightSpritesheet.png'},
        {id: 'lightSprite', src: 'assets/light.png'},
        // {id: 'anglerSpritesheet', src: 'assets/anglerSpritesheet.png'},
        {id: 'anglerSprite1', src: 'assets/angler1.png'},
        {id: 'anglerSprite2', src: 'assets/angler2.png'},
    // music
        {id: 'backgroundMusic', src: 'assets/music.mp3'},
        {id: 'gameOverMusic', src: 'assets/game_over.mp3'},
    // sfx
        {id: 'shot', src: 'assets/shot.mp3'},
        {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
        // {id: 'deathSound', src: 'assets/die.mp3'},
		{id: 'deathSound2', src: 'assets/die_2.mp3'},
		{id: 'deathSound3', src: 'assets/die_3.mp3'},
    ]);
    queue.load();

    /*
     *      Create a timer that updates once per second
     *
     */
    gameTimer = setInterval(updateTime, 1000);

	/*
	*		Load sound files
	*
	*/
	// createjs.Sound.registerSound("assets/storm.mp3", soundID);

    /*
     *      Handle keyboard input
     * 
     */
    this.document.onkeydown = handleKeyDown;
}

function queueLoaded(event)
{
    qLoaded = true;
	
	// remove wait for assets to load msg
	var elem = document.getElementById("waitLoad");
	elem.parentNode.removeChild(elem);
    
    // Add background images
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"));
    backgroundImage.alpha = backgroundAlpha;
    stage.addChild(backgroundImage);

    menu = new createjs.Bitmap(queue.getResult("menu"));
    menu.alpha = menuAlpha;
    stage.addChild(menu);

    backgroundSun = new createjs.Bitmap(queue.getResult("backgroundSun"));
    backgroundSun.alpha = bgSunAlpha;
    stage.addChildAt(backgroundSun, 1);

    backgroundBlue = new createjs.Bitmap(queue.getResult("backgroundBlue"));
    backgroundBlue.alpha = bgBlueAlpha;
    stage.addChildAt(backgroundBlue, 1);

    backgroundBoss = new createjs.Bitmap(queue.getResult("backgroundBoss"));
    backgroundBoss.alpha = bgBossAlpha;
    stage.addChildAt(backgroundBoss, 2);

    level1 = new createjs.Bitmap(queue.getResult("level1"));
    level1.alpha = bgLevel1Alpha;
    stage.addChildAt(level1, 3);

    level2 = new createjs.Bitmap(queue.getResult("level2"));
    level2.alpha = bgLevel2Alpha;
    stage.addChildAt(level2, 3)

    level3 = new createjs.Bitmap(queue.getResult("level3"));
    level3.alpha = bgLevel3Alpha;
    stage.addChildAt(level3, 3)

    //Add Score
    scoreText = new createjs.Text("Lights Found: " + score.toString() + "/" + eInit.NUM_LIGHTS.toString(), "36px Georgia", textColor);
    scoreText.x = 20;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Ad Timer
    timerText = new createjs.Text("Time Left: " + gameTime.toString(), "36px Georgia", textColor);
    timerText.x = WIDTH-230;
    timerText.y = 10;
    stage.addChild(timerText);

    // Play background sound
    createjs.Sound.play("backgroundMusic", {loop: -1});

    // Create nobody spritesheet
    nobodySpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('nobodySpritesheet')],
        "frames": {"width": eBounds.NOBODY_WIDTH, "height": eBounds.NOBODY_HEIGHT},
        "animations": { "swim": [0,0] }
    });

    // Create nobody sprite
    createNobody();
    createLights();
    createAnglers();

    // Add ticker
    createjs.Ticker.setFPS(gameFPS);
    createjs.Ticker.addEventListener('tick', tickEvent);
    createjs.Ticker.addEventListener('tick', stage);
}

function createNobody()
{
	animation = new createjs.Sprite(nobodySpriteSheet, "swim");
    animation.regX = eBounds.NOBODY_WIDTH/2;
    animation.regY = eBounds.NOBODY_HEIGHT/2;
    animation.x = nobodyXPos;
    animation.y = nobodyYPos;
    animation.width = eBounds.NOBODY_WIDTH;
    animation.height = eBounds.NOBODY_HEIGHT;
    animation.alpha = nobodyAlpha;
    animation.gotoAndPlay("swim");
    stage.addChildAt(animation, eDepths.NOBODY);

    // animation = new createjs.Bitmap(queue.getResult("nobodySprite"));
    // animation.regX = eBounds.NOBODY_WIDTH/2;
    // animation.regY = eBounds.NOBODY_HEIGHT/2;
    // animation.x = nobodyXPos;
    // animation.y = nobodyYPos;
    // animation.width = eBounds.NOBODY_WIDTH;
    // animation.height = eBounds.NOBODY_HEIGHT;
    // animation.alpha = nobodyAlpha;
    // stage.addChildAt(animation, eDepths.NOBODY);

    // animationHitbox = new createjs.Shape();
    // animationHitbox.graphics.beginStroke("#0f0").drawRect(
    //     animation.regX - eBounds.NOBODY_WIDTH/2,
    //     animation.regY - eBounds.NOBODY_HEIGHT/2,
    //     eBounds.NOBODY_WIDTH,
    //     eBounds.NOBODY_HEIGHT
    // );
    // stage.addChild(animationHitbox);
}

function createLights()
{
    for (i = 0; i < numLights; ++i) {
        lightsAnimation.push( new createjs.Bitmap(queue.getResult("lightSprite")) );
        lightsXSpeed.push(Math.random()*eSpeeds.LIGHTS_X*plusOrMinus()*Math.random());
        lightsYSpeed.push(Math.random()*eSpeeds.LIGHTS_Y*plusOrMinus()*Math.random());
        lightsAnimation[i].regX = eBounds.LIGHT_WIDTH/2;
        lightsAnimation[i].regY = eBounds.LIGHT_HEIGHT/2;
        lightsAnimation[i].x = Math.random()*WIDTH;
        lightsAnimation[i].y = Math.random()*HEIGHT;
        lightsAnimation[i].width = eBounds.LIGHT_WIDTH;
        lightsAnimation[i].height = eBounds.LIGHT_HEIGHT;
        lightsAnimation[i].alpha = lightAlpha + alphaRange*Math.random();
        stage.addChildAt(lightsAnimation[i], eDepths.LIGHT);
    }
}

function createAnglers()
{
    for ( i = 0; i < numAnglers; ++i ) {
        if (plusOrMinus() == -1) {
            anglersAnimation.push( new createjs.Bitmap(queue.getResult("anglerSprite1")) );
        } else {
            anglersAnimation.push( new createjs.Bitmap(queue.getResult("anglerSprite2")) );
        }
        anglersXSpeed.push(Math.random()*eSpeeds.ANGLERS_X*plusOrMinus()*Math.random());
        anglersYSpeed.push(Math.random()*eSpeeds.ANGLERS_Y*plusOrMinus()*Math.random());
        anglersAnimation[i].regX = eBounds.ANGLER_WIDTH/2;
        anglersAnimation[i].regY = eBounds.ANGLER_HEIGHT/2;
        anglersAnimation[i].x = Math.random()*WIDTH;
        anglersAnimation[i].y = Math.random()*HEIGHT;
        anglersAnimation[i].width = eBounds.ANGLER_WIDTH;
        anglersAnimation[i].height = eBounds.ANGLER_HEIGHT;
        anglersAnimation[i].alpha = anglerAlpha + alphaRange*Math.random();
        stage.addChildAt(anglersAnimation[i], eDepths.ANGLER);
    }
}

function nobodyDeath()
{
    deathAnimation = new createjs.Bitmap(queue.getResult("nobodyDeath"));
    deathAnimation.regX = eBounds.NOBODY_WIDTH/2;
    deathAnimation.regY = eBounds.NOBODY_HEIGHT/2;
    deathAnimation.x = nobodyXPos;
    deathAnimation.y = nobodyYPos;
    deathAnimation.alpha = nobodyAlpha;
    stage.addChildAt(deathAnimation, eDepths.NOBODY);
    createjs.Sound.play("shot");
}

function lightDeath(i)
{
    stage.removeChild(lightsAnimation[i]);
    lightsAnimation[i] = null;
    lightsAnimation.splice(i, 1);
    numLights--;
    lightAlpha += 0.03;
    for ( i = 0; i < numLights; ++i ) {
        lightsAnimation[i].alpha = lightAlpha;
    }
    score++;
    scoreText.text = "Lights Found: " + score.toString() + "/" + eInit.NUM_LIGHTS.toString();
    switch (currLevel) {
        case 1:
            currLevel++;
            stage.removeChild(level1);
            break;
        case 2:
            currLevel++;
            stage.removeChild(level2);
            break;
        case 3:
            currLevel++;
            stage.removeChild(level3);
            break;
        case 4:
            currLevel++;
            backgroundSun.alpha += iSunRate;
            break;
        case 5:
            currLevel++;
            backgroundSun.alpha += iSunRate;
            break;
        default:
            break;
    }
    createjs.Sound.play("deathSound2");
}

function tickEvent()
{
    // don't handle collision or anything if game is in end scene (super annoying!)
	if ( lockScene ) return;
    if ( waitForSpace ) return;
    if ( endscene )
    {
        backgroundBoss.alpha += iBossAppearRate;
        return;
    }
    if ( winscene )
    {
        backgroundSun.alpha += iBossAppearRate;
        backgroundBlue.alpha += iBossAppearRate;
        animation.alpha += iBossAppearRate;
        return;
    }
    
	// Nobody move & boundary logic
	if(nobodyXPos < WIDTH && nobodyXPos > 0)
	{
		nobodyXPos += nobodyXSpeed;
	} else 
	{
		nobodyXSpeed = nobodyXSpeed * (-1);
		nobodyXPos += nobodyXSpeed;
	}
	if(nobodyYPos < HEIGHT && nobodyYPos > 0)
	{
		nobodyYPos += nobodyYSpeed;
	} else
	{
		nobodyYSpeed = nobodyYSpeed * (-1);
		nobodyYPos += nobodyYSpeed;
	}
	animation.x = nobodyXPos;
    animation.y = nobodyYPos;
    // animationHitbox.x = animation.x - eBounds.NOBODY_WIDTH/2;
    // animationHitbox.y = animation.y - eBounds.NOBODY_HEIGHT/2;
    // animationHitbox.alpha = 0;

    // Lights move & boundary logic
	for ( i = 0; i < numLights; ++i ) {
        if(lightsAnimation[i].x < WIDTH && lightsAnimation[i].x > 0)
        {
            lightsAnimation[i].x += lightsXSpeed[i];
        } else {
            lightsXSpeed[i] = lightsXSpeed[i] * (-1);
            lightsAnimation[i].x += lightsXSpeed[i];
        }
        
        if(lightsAnimation[i].y < HEIGHT && lightsAnimation[i].y > 0)
        {
            lightsAnimation[i].y += lightsYSpeed[i];
        } else {
            lightsYSpeed[i] = lightsYSpeed[i] * (-1);
            lightsAnimation[i].y += lightsYSpeed[i];
        }
    }

    /*
     *      Anglers move & boundary logic
     */
     for ( i = 0; i < numAnglers; ++i ) {
        if(anglersAnimation[i].x < WIDTH && anglersAnimation[i].x > 0)
        {
            anglersAnimation[i].x += anglersXSpeed[i];
        } else {
            anglersXSpeed[i] = anglersXSpeed[i] * (-1);
            anglersAnimation[i].x += anglersXSpeed[i];
        }
        
        if(anglersAnimation[i].y < HEIGHT && anglersAnimation[i].y > 0)
        {
            anglersAnimation[i].y += anglersYSpeed[i];
        } else {
            anglersYSpeed[i] = anglersYSpeed[i] * (-1);
            anglersAnimation[i].y += anglersYSpeed[i];
        }
    }

    // do not start any collisions for 3 seconds
    if ( beginCollisions == false ) return;
    
    /*
     *      Nobody collision test vs. lightsanimation (/3 for smaller hitboxes)
     */
     for ( i = 0; i < numLights; ++i ) {
         var rect1 = {  x: animation.x - eBounds.NOBODY_WIDTH/3,
                        y: animation.y - eBounds.NOBODY_HEIGHT/3,
                        width: eBounds.NOBODY_WIDTH/3,
                        height: eBounds.NOBODY_HEIGHT/3
                    };
        var rect2 = {   x: lightsAnimation[i].x - eBounds.LIGHT_WIDTH/3,
                        y: lightsAnimation[i].y - eBounds.LIGHT_HEIGHT/3,
                        width: eBounds.LIGHT_WIDTH/3,
                        height: eBounds.LIGHT_HEIGHT/3
                    };
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y)
        {
            // capture the light and nobody gets a clearer picture of who s/he is
            lightDeath(i);
            nobodyAlpha += iNobodyLightRate;
            animation.alpha = nobodyAlpha;
        }
    }

    /*
     *      Nobody collision test vs. anglersanimation (/3 for smaller hitboxes)
     */
    for ( i = 0; i < numAnglers; ++i ) {
        var rect1 = {  x: animation.x - eBounds.NOBODY_WIDTH*.4,
                        y: animation.y - eBounds.NOBODY_HEIGHT*.4,
                        width: eBounds.NOBODY_WIDTH*.8,
                        height: eBounds.NOBODY_HEIGHT*.8
                    };
        var rect2 = {   x: anglersAnimation[i].x,
                        y: anglersAnimation[i].y,
                        width: eBounds.ANGLER_WIDTH*.5,
                        height: eBounds.ANGLER_HEIGHT*.5
                    };
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y)
        {
            anglersAnimation[i].alpha += iScareRate;
            if ( anglersAnimation[i].alpha >= 1.0 )
            {
                gameOver();
            }
        }
    }
}

function updateTime()
{
	if ( lockScene ) return;
    if ( waitForSpace ) return;
	if ( endscene || winscene ) return;

	gameTime--;
    if ( score >= eInit.NUM_LIGHTS )
    {
        youWin();
    }
	else if ( gameTime <= 0 )
	{
        gameOver();
	}
	else
	{
		timerText.text = "Time Left: " + gameTime;
	}
}

function gameOver() {
	// lock scene for a second
	lockScene = true;
	setTimeout( function() { lockScene = false; }, 2000 );
	
    endscene = true;
    stage.removeChild(animation);
    nobodyDeath();
    timerText.text = "YOU LOSE";
    createjs.Sound.stop();
    createjs.Sound.play("deathSound3");
    setTimeout(function() {createjs.Sound.play("gameOverSound")}, 1000);
    createjs.Sound.play("gameOverMusic");
}

function youWin() {
	// lock scene for a second
	lockScene = true;
	setTimeout( function() { lockScene = false; }, 2000 );
	
    winscene = true;
    timerText.text = "YOU WIN!!!";
    createjs.Sound.stop();
    createjs.Sound.play("gameOverMusic");
}

/*
 *      Handle keyboard presses
 */
function handleKeyDown(event) {
	if (lockScene) return;
	if (qLoaded == false) return;

	switch (event.keyCode) {
		case KEYCODE_LEFT:
			console.log("LEFT");
			if (nobodyXSpeed > 0) nobodyXSpeed *= -1;
			break;
		case KEYCODE_RIGHT:
			console.log("RIGHT");
			if (nobodyXSpeed < 0) nobodyXSpeed *= -1;
			break;
		case KEYCODE_UP:
			console.log("UP");
			if (nobodyYSpeed > 0) nobodyYSpeed *= -1;
			break;
		case KEYCODE_DOWN:
			console.log("DOWN");
			if (nobodyYSpeed < 0) nobodyYSpeed *= -1;
			break;

		case KEYCODE_SPACE:
			console.log("SPACE");
                
			// block until space is pressed and game begins
			if (waitForSpace) {
				waitForSpace = false;
				if (menu) {
					stage.removeChild(menu);
					menu = null;
				}

				// set a timeout before collisions can take place
				setTimeout(function () { beginCollisions = true; console.log("collision ON"); }, 5000);
			}
				
			// space after endscene or winscene will restart to menu
			if (endscene || winscene) {
				restartToMenu();
					
				// set a timeout before collisions can take place
				setTimeout(function () { beginCollisions = true; console.log("collision ON"); }, 2000+5000);
			}
			break;

		// case KEYCODE_W:
		// 	if (waitForSpace) return;
		// 	console.log("W");
		// 	score = eInit.NUM_LIGHTS;
		// 	break;
		// case KEYCODE_L:
		// 	if (waitForSpace) return;
		// 	console.log("L");
		// 	gameTime = 0;
		// 	break;
	}
}

/*
 *      Helper function that returns either a +1/-1
 */
function plusOrMinus() {
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return plusOrMinus;
}

/*
 *		Restart the game to menu if endscene or winscene
 */
function restartToMenu() {
	console.log("RESTARTING TO MENU");
	
	// remove and recreate all the lights
	for ( i = 0; i < numLights; ++i ) {
		stage.removeChild(lightsAnimation[0]);
		lightsAnimation[0] = null;
		lightsAnimation.splice(0, 1);	
	}
	numLights = eInit.NUM_LIGHTS;
	createLights();
	
	// recreate nobody if endscene
	if ( endscene ) {
		stage.removeChild(deathAnimation);
		deathAnimation = null;
		stage.addChildAt(animation, eDepths.NOBODY);
	}
	
	// reset levels
	currLevel = 1;
	stage.addChildAt(level1, 3);
	stage.addChildAt(level2, 3);
	stage.addChildAt(level3, 3);
	
	// reset alphas
	bgBlueAlpha = 0.05;
	bgSunAlpha = 0.15;
	bgBossAlpha = 0.02;
	bgLevel1Alpha = 0.3;
	bgLevel2Alpha = 0.3;
	bgLevel3Alpha = 0.3;
	nobodyAlpha = 0.30;
	lightAlpha = 0.05;
	anglerAlpha = 0.05;
	backgroundBlue.alpha = bgBlueAlpha;
	backgroundSun.alpha = bgSunAlpha;
	backgroundBoss.alpha = bgBossAlpha;
	level1.alpha = bgLevel1Alpha;
	level2.alpha = bgLevel2Alpha;
	level3.alpha = bgLevel3Alpha;
	animation.alpha = nobodyAlpha;
	for ( i = 0; i < numLights; ++i ) { lightsAnimation[i].alpha = lightAlpha + alphaRange*Math.random(); }
	for ( i = 0; i < numAnglers; ++i ) { anglersAnimation[i].alpha = anglerAlpha + alphaRange*Math.random(); }	
	
	// reset positions
	nobodyXPos = 100;
	nobodyYPos = 100;
	nobodyXSpeed = 1.75;
	nobodyYSpeed = 2.25;
	
	// reset timers and text
	score = 0;
	gameTime = 99;
	scoreText.text = "Lights Found: " + score.toString() + "/" + eInit.NUM_LIGHTS.toString();
	timerText.text = "Time Left: " + gameTime;
		
	// reset sounds
	createjs.Sound.stop();
	createjs.Sound.play("backgroundMusic", {loop: -1});
	
	// reset flags
	endscene = winscene = beginCollisions = false;
}




