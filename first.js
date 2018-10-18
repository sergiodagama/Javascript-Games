var context, controller, rectangle, loop;
var h_canvas = 450, w_canvas = 650;
var gravity = 30, h_floor = 25;
var level_up = false, level_down = false;
var level = 0, max_obstacles = 5, obs_width = 100;
var obs_x = new Array();
var obs_y = new Array();
var endObs = false;
var obstacles = [];
var bitlevel;
var precision = 4; //Related to how velocities work and changed the position. The coord cannot be altered by more than 1.5 it seems

class Rectangle {

	constructor(x1, y1, x2, y2) {

		this.x1 = x1;
		this.y1 = y1
		this.x2 = x2;
		this.y2 = y2;

	}

	DrawObject() {
		context.fillStyle = "#af4112";
		context.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);

	}

}

class Level {

	constructor(obstaclesarray, width, height) {
		this.obstaclesarray = obstaclesarray;
		this.bitmap = this.MakeBitMap(width, height);
	}

	DrawLevel() { //Draws all the objects from the level
		for (var object of this.obstaclesarray) {
			object.DrawObject();
		}
	}

	MakeBitMap(bit_width, bit_height) {

		//Creates a bit map width * height
		var bitmap = [];
		for (var i = 0; i < bit_height; i++) {
			let line_bitmap = [];
			for (var j = 0; j < bit_width; j++) {
				line_bitmap.push(0);
			}
			bitmap.push(line_bitmap);
		}

		//Changes the bit map
		for (var object of this.obstaclesarray) {
			for (var i = object.x1; i < object.x2 + 1; i++) {
				for (var j = object.y1; j < object.y2 + 1; j++) {
					bitmap[j][i] = 1;
				}
			}
		}

		return bitmap;
	}

}

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = h_canvas;
context.canvas.width = w_canvas;


//Level 0 and initializes the bitlevel as level 0
for (var i = 0; i < 5; i++) {
	topleftx = (120 + (100 * i));
	toplefty = (300 - (50 * i));
	let rectangle = new Rectangle(topleftx, toplefty, topleftx + 100, toplefty + 20);
	obstacles.push(rectangle);
}
bitlevel = new Level(obstacles, w_canvas, h_canvas);

rectangle = {

	height: 32,
	jumping: true,
	width: 32,
	x: (w_canvas / 10), //starting point
	x_velocity: 0,
	y: 0,
	y_velocity: 0,
	lastx: (w_canvas / 10),
	lasty: 0,

};

controller = {

	left: false,
	right: false,
	up: false,
	keyListener: function (event) {

		var key_state = (event.type == "keydown") ? true : false;

		switch (event.keyCode) {

			case 37:// left key
				controller.left = key_state;
				break;
			case 38:// up key
				controller.up = key_state;
				break;
			case 39:// right key
				controller.right = key_state;
				break;

		}

	}

};
loop = function () {

	if (controller.up && rectangle.jumping == false) {

		rectangle.y_velocity -= gravity;
		rectangle.jumping = true;

	}

	if (controller.left) {

		rectangle.x_velocity -= 0.5;

	}

	if (controller.right) {

		rectangle.x_velocity += 0.5;

	}

	rectangle.y_velocity += 1.5;// gravity
	rectangle.x += rectangle.x_velocity;
	rectangle.y += rectangle.y_velocity;
	rectangle.x_velocity *= 0.9;// friction
	rectangle.y_velocity *= 0.9;// friction

	// if rectangle is falling below floor line
	if (rectangle.y > h_canvas - h_floor - 37) {

		rectangle.jumping = false;
		rectangle.y = h_canvas - h_floor - 37;
		rectangle.y_velocity = 0;

	}
	//Collision against the random obstacles
	//missing code
	if (level == 0 && rectangle.x < 0) {
		rectangle.x = 0;
	} else if (rectangle.x < -32 && level > 0) { // if rectangle is going off the left of the screen 

		rectangle.x = w_canvas;
		level_down = true;
		level -= 1;

	} else if (rectangle.x > w_canvas) {// if rectangle goes past right boundary

		rectangle.x = -32;
		level_up = true;
		level += 1;
	}

	Collision();


	context.fillStyle = "#202020";
	context.fillRect(0, 0, w_canvas, h_canvas);// x, y, width, height
	context.fillStyle = "#ff0000";// hex for red
	context.beginPath();
	context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	context.fill();
	context.strokeStyle = "#207830";
	context.lineWidth = 10;
	context.beginPath();
	context.moveTo(0, (h_canvas - h_floor));
	context.lineTo(w_canvas, (h_canvas - h_floor));
	context.stroke();
	//Obstacles
	context.fillStyle = "#af4112";

	bitlevel.DrawLevel(); //Draws the level

	//After doing everything changes the lastx and last y so it can be used in the next frame
	//We do the parseInt here so we don't need to do it in the Collision function
	rectangle.lastx = parseInt(rectangle.x);
	rectangle.lasty = parseInt(rectangle.y);

	//show level on screen 
	context.fillStyle = "#ffffff";
	context.font = "25px Arial";
	context.fillText("Level " + level, w_canvas - 120, 40);
	context.fillText("Coord: " + parseInt(rectangle.x) + " " + parseInt(rectangle.y), w_canvas - 400, 80);
	// call update when the browser is ready to draw again
	window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

function Collision() { //Will use the bitmap for the current level

	var collision_bitmap = bitlevel.bitmap;
	//Initializes the coords we might need, eventually
	let x1 = parseInt(rectangle.x);
	let y1 = parseInt(rectangle.y);
	let x2 = x1 + rectangle.width;
	let y2 = y1 + rectangle.height;

	let Lx1 = rectangle.lastx;
	let Ly1 = rectangle.lasty;
	let Lx2 = x1 + rectangle.width;
	let Ly2 = y1 + rectangle.height;

	//The system checks the position of the corners
	//Might not work if the objects are too small (smaller than the rectangle)
	//For that we can check in the middle and in the center as well

	if(collision_bitmap[y1][x1]){ //Top left corner has hit an object
		if(Ly1 > y1){ //If the object is jumping
			if(collision_bitmap[y1+precision][x1]){
				rectangle.y_velocity = 0;
			}
			
		}

		/*
		if(collision_bitmap[y1][x1+precision]){ //If it has hit a wall from the right
			rectangle.x_velocity = 0;
		}
		*/
	}

	else if(collision_bitmap[y1][x2]){ //Top right corner has hit an object

		if(Ly1 > y1){ //If the object is jumping
			if(collision_bitmap[y1+precision][x2]){
				rectangle.y_velocity = 0;
			}
			
		}

		/*
		if(collision_bitmap[y1][x2-precision]){ //If it has hit a wall from the left
			rectangle.x_velocity = 0;
		}
		*/
		
	}

	else if(collision_bitmap[y2][x1]){ //Bot left corner has hit an object
		
		if(Ly1 < y1){ //If the object is falling
			if(collision_bitmap[y2-precision][x1]){
				rectangle.y_velocity = 0;
				rectangle.y -=precision-1;
				rectangle.jumping = false;
			}
			
		}

		/*
		if(collision_bitmap[y2][x1+precision]){ //If it has hit a wall from the right
			rectangle.x_velocity = 0;
		}
		*/

	}

	else if(collision_bitmap[y1][x2]){ //Bot right corner has hit an object

		if(Ly1 < y1){ //If the object is falling
			if(collision_bitmap[y2-precision][x2]){
				rectangle.y_velocity = 0;
				rectangle.y -=precision-1;
				rectangle.jumping = false;
			}
			
		}

		/*
		if(collision_bitmap[y2][x2-precision]){ //If it has hit a wall from the left
			rectangle.x_velocity = 0;
		}
		*/
		
	}

	/*
	if (collision_bitmap[y2][x1] || collision_bitmap[y2][x2]) { //If one of the bottom corners has hit an object.

		
		if (Ly1 < y1) { //If the object is falling and has hit an object

			//We have to cancel the jumping
			rectangle.jumping = false;
			//We have to say that the vertical velocity is 0
			rectangle.y_velocity = 0;
			//We have to put the rectangle above the object
			var corner;
			if (collision_bitmap[y2][x1]) { //If the bottom left corner has hit the object
				corner = x1;
			}
			else if (collision_bitmap[y2][x2]) //If the bottom right corner has hit the object
				corner = x2;
			do {
				counter++;
			} while (bitmap[y1 - counter][corner])
		}

	}
	else if(collision_bitmap[y1][x1] || collision_bitmap[y1][x2]){ //One of the top corners has hit an object
		

	}
	*/
}