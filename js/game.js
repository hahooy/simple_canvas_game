// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
// hero object, there is only one hero
var hero = {
    speed: 256 // movement in pixels per second
};
// monster object, there are three monster
var Monster = (function(speed) {
    this.speed = speed;
});

var monsters = new Map();
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
    var i = 0;
    var monstersLimit = 10;
    var numOfMonsters = 1 + Math.random() * (monstersLimit - 1);

    // set the initial position of the hero to the center
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // create monsters in a random number
    for (i = 0; i < numOfMonsters; i++) {
	monsters.set(i, new Monster(100));
    }

    // Throw the monster somewhere on the screen randomly
    for (i = 0; i < monsters.size; i++) {
	monsters.get(i).x = 32 + (Math.random() * (canvas.width - 65));
	monsters.get(i).y = 32 + (Math.random() * (canvas.height - 65));
    }
};

// Update game objects
var update = function (modifier) {
    var i = 0; // counter    

    if (38 in keysDown && hero.y >= 0) { // Player holding up
	hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - 30) { // Player holding down
	hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x >= 0) { // Player holding left
	hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - 30) { // Player holding right
	hero.x += hero.speed * modifier;
    }


    // Are they touching?
    function deleteTouch(value, key, map) {
	if (
	    hero.x <= (value.x + 30)
		&& value.x <= (hero.x + 32)
		&& hero.y <= (value.y + 32)
		&& value.y <= (hero.y + 32)
	) {
	    ++monstersCaught;
	    map.delete(key);
	}
    }

    function updateMonsterPos(value, key, map) {
	if (value.x < 0
	    || value.x > canvas.width) {
	    value.speed = -value.speed;
	}
	value.x += value.speed * modifier;
    }
	
    monsters.forEach(deleteTouch);
    monsters.forEach(updateMonsterPos);

    if (monsters.size === 0) {
	reset();
    }
};

// Draw everything
var render = function () {
    function drawMonsters(value, key, map) {
	ctx.drawImage(monsterImage, value.x, value.y);
    }

    if (bgReady) {
	ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
	ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
	monsters.forEach(drawMonsters);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// display winning image
var winningRender = function() {
    if (bgReady) {
	ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
	ctx.drawImage(heroImage, hero.x, hero.y);
    }

    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "36px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("You win the game", 100, 100);
}

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    if (monstersCaught < 10) {
	requestAnimationFrame(main);
    } else {
	winningRender();
    }
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
