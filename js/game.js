// Create the canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

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
// hero object
var hero = {
    speed: 256 // movement in pixels per second
};
// monster object
var Monster = (function(vx, vy) {
    this.vx = vx;
    this.vy = vy;
});

var monsters = [];
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
    var monstersLimit = 3;
    var numOfMonsters = 1 + Math.random() * (monstersLimit - 1);
    monsters = [];

    // set the initial position of the hero to the center
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // create monsters in a random number with random initial velocity
    for (i = 0; i < numOfMonsters; i++) {
	monsters.push( new Monster(-100 + Math.random() * 200, -100 + Math.random() * 200));
    }

    // Throw the monster somewhere on the screen randomly
    for (i = 0; i < monsters.length; i++) {
	monsters[i].x = 32 + (Math.random() * (canvas.width - 65));
	monsters[i].y = 32 + (Math.random() * (canvas.height - 65));
    }
};

// trun a goblin to be crazy fast
window.document.getElementById("crazy").onclick = function() {
    // generate a monster with high speed
    var crazyMonster = new Monster(200 + Math.random() * 150, 200 + Math.random() * 150);
    crazyMonster.x = 32 + (Math.random() * (canvas.width - 65));
    crazyMonster.y = 32 + (Math.random() * (canvas.height - 65));
    monsters.push(crazyMonster);
    crazyMonster = null;    
    render();

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
    monsters = monsters.filter(function(monster) {
	if (
	    hero.x <= (monster.x + 30)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
	    monstersCaught++;	    
	    return false;
	} else {
	    return true;
	}
    });

    // update the position of monsters    
    monsters.forEach(function(monster) {
	if (monster.x + monster.vx * modifier < 0
	    || monster.x + monster.vx * modifier> canvas.width) {
	    monster.vx = -monster.vx;
	}
	if (monster.y + monster.vy * modifier < 0 || monster.y + monster.vy * modifier > canvas.height) {
	    monster.vy = -monster.vy;
	}
	monster.x += monster.vx * modifier;
	monster.y += monster.vy * modifier;
    });

    if (monsters.length === 0) {
	reset();
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
	ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
	ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
	monsters.forEach(function(monster) {
	    ctx.drawImage(monsterImage, monster.x, monster.y);
	});
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
    ctx.fillText("You win the game", 100, 150);
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


// restart the game by clicking on the Restart button
window.document.getElementById("restart").onclick = function() {
    reset();
    monstersCaught = 0;
    main();
};

// Let's play this game!
var then = Date.now();
reset();
main();
