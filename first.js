var context, controller, rectangle, loop;
var h_canvas = 450,
	w_canvas = 650;
var impulse = 25,
	h_floor = 25;
var level = 0,
	isOnTop = false;
var obsArray = [];

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = h_canvas;
context.canvas.width = w_canvas;


rectangle = {
	width: 30,
	height: 30,
	jumping: true,
	x: w_canvas / 10, //starting point
	y: 0,
	x_velocity: 0,
	y_velocity: 0,
	// get the four side coordinates of the rectangle
	get bottom() { return this.y + this.height; },
	get left() { return this.x; },
	get right() { return this.x + this.width; },
	get top() { return this.y; },
};

class obs {

	constructor(x, y, width, height, color) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;
		this.collision = '';
		//bottom - the rectangle hit with the bottom
		//left - the rectangle hit with the left
		//right - the rectangle hit with the right
		//top - the rectangle hit with the top
	}

	get bottom() { return this.y + this.height; }
	get left() { return this.x; }
	get right() { return this.x + this.width; }
	get top() { return this.y; }

	drawObs() {
		context.fillStyle = this.color;
		context.beginPath();
		context.fillRect(this.x, this.y, this.width, this.height, this.color);
	}

	collisionDetection() {

		this.collision = '';
		//Bot right
		if (rectangle.right > this.left && rectangle.right < this.right && rectangle.bottom > this.top && rectangle.bottom < this.bottom) {
			//If the bot right of the rectangle has hit an obstacle

			console.log(rectangle.bottom > this.top && rectangle.bottom < this.bottom)
			console.log("bot right collision");

			if (rectangle.x_velocity === 0) {//It just fell down
				this.collision = 'bottom' //The bottom of the rectagle collided
			}

			else if (rectangle.x_velocity < 0) { //It fell left and down, if there was a collision it must have been on the top
				this.collision = 'bottom'
			}

			else if (rectangle.x_velocity > 0) { //It fell right and down, so it might have it the top or the left of the obstacle

				/*if (rectangle.right >= this.left) { //It was already right of the obstacle, so it must have hit the top
					this.collision = 'bottom';
				}
	
				else if (rectangle.bottom >= this.top) { //It was already bellow the top of the obstacle so it must have hit the left
					this.collision = 'right';
				}
	
				else { */

				//We don't know if we hit the top or the left

				let rectangle_displacement_slope = rectangle.y_velocity / rectangle.x_velocity; //Gets the slope of the movement of the rectangle

				let last_bottom = rectangle.bottom - 10 / 9 * rectangle.y_velocity; //Reverses the position update
				let last_right = rectangle.right - 10 / 9 * rectangle.x_velocity; //Reverses the position update

				let object_displacement_slope = (last_bottom - rectangle.top) / (last_right - rectangle.left); //Gets the slope that is key to identify if the object goes on top or on the side

				console.log("object slope is" + object_displacement_slope);
				console.log("rectangle slope is " + rectangle_displacement_slope);
				if (object_displacement_slope > rectangle_displacement_slope) { //Side hit
					this.collision = 'right';
				}
				else {
					this.collision = 'bottom';
				}

				//}
			}

		}

		//Bot left
		else if (rectangle.left > this.left && rectangle.left < this.right && rectangle.bottom > this.top && rectangle.bottom < this.bottom) {
			//If the bot left of the rectangle has hit an obstacle

				console.log(rectangle.bottom < this.bottom);
				console.log("bot left collision");

				if (rectangle.x_velocity === 0) {//It just fell down
					this.collision = 'bottom' //The bottom of the rectagle collided
				}

				else if (rectangle.x_velocity > 0) { //It fell right and down, if there was a collision it must have been on the top
					this.collision = 'bottom'
				}

				else if (rectangle.x_velocity < 0) { //It fell left and down, so it might have it the top or the right of the obstacle

					/*if (rectangle.left <= this.right) { //It was already right of the obstacle, so it must have hit the top
						this.collision = 'bottom';
					}
			
					else if (rectangle.bottom <= this.top) { //It was already bellow the top of the obstacle so it must have hit the left
						this.collision = 'right';
					}
			
					else { */
					//We don't know if we hit the top or the right
					let rectangle_displacement_slope = rectangle.y_velocity / rectangle.x_velocity; //Gets the slope of the movement of the rectangle

					let last_bottom = rectangle.bottom - 10 / 9 * rectangle.y_velocity; //Reverses the position update
					let last_left = rectangle.left - 10 / 9 * rectangle.x_velocity; //Reverses the position update

					let object_displacement_slope = (last_bottom - rectangle.top) / (last_left - rectangle.right); //Gets the slope that is key to identify if the object goes on top or on the side

					console.log("object slope is" + object_displacement_slope);
					console.log("rectangle slope is " + rectangle_displacement_slope);

					if (object_displacement_slope < rectangle_displacement_slope) { //Side hit
						this.collision = 'left';
					}
					else { //Bottom hit
						this.collision = 'bottom';
					}

					//}
				}

		}

		//Top right
		else if (rectangle.right > this.left && rectangle.right < this.right && rectangle.top > this.top && rectangle.top < this.bottom) {
			//If the top right of the rectangle has hit an obstacle

			console.log("top right collision");

			if (rectangle.x_velocity === 0) {//It just jumped up
				this.collision = 'top' //The top of the rectagle collided
			}

			else if (rectangle.x_velocity < 0) { //It jumped left and up, if there was a collision it must have been on the bottom
				this.collision = 'top'
			}

			else if (rectangle.x_velocity > 0) { //It jumped right and down, so it might have it the top or the left of the obstacle

				/*if (rectangle.right >= this.left) { //It was already right of the obstacle, so it must have hit the bottom
					this.collision = 'top';
				}
			
				else if (rectangle.top <= this.bottom) { //It was already above the bottom of the obstacle so it must have hit the left
					this.collision = 'left';
				}
			
				else { */
				//We don't know if we hit the top or the left
				let rectangle_displacement_slope = rectangle.y_velocity / rectangle.x_velocity; //Gets the slope of the movement of the rectangle

				let last_top = rectangle.top - 10 / 9 * rectangle.y_velocity; //Reverses the position update
				let last_right = rectangle.right - 10 / 9 * rectangle.x_velocity; //Reverses the position update

				let object_displacement_slope = (last_top - rectangle.bottom) / (last_right - rectangle.left); //Gets the slope that is key to identify if the object goes on bottom or on the side

				console.log("object slope is" + object_displacement_slope);
				console.log("rectangle slope is " + rectangle_displacement_slope);

				if (object_displacement_slope < rectangle_displacement_slope) { //Side hit
					this.collision = 'right';
				}
				else { //Top hit
					this.collision = 'top';
				}

				//}
			}


		}

		//Top left
		else if (rectangle.left > this.left && rectangle.left < this.right && rectangle.top > this.top && rectangle.top < this.bottom) {
			//If the bot left of the rectangle has hit an obstacle

				console.log(rectangle.top < this.bottom);
				console.log("top left collision");

				if (rectangle.x_velocity === 0) {//It just fell down
					this.collision = 'top' //The bottom of the rectagle collided
				}

				else if (rectangle.x_velocity > 0) { //It fell right and down, if there was a collision it must have been on the top
					this.collision = 'top'
				}

				else if (rectangle.x_velocity < 0) { //It fell left and down, so it might have it the top or the right of the obstacle

					/*if (rectangle.left <= this.right) { //It was already right of the obstacle, so it must have hit the top
						this.collision = 'bottom';
					}
			
					else if (rectangle.bottom <= this.top) { //It was already bellow the top of the obstacle so it must have hit the left
						this.collision = 'right';
					}
			
					else { */
					//We don't know if we hit the top or the right
					let rectangle_displacement_slope = rectangle.y_velocity / rectangle.x_velocity; //Gets the slope of the movement of the rectangle

					let last_bottom = rectangle.bottom - 10 / 9 * rectangle.y_velocity; //Reverses the position update
					let last_left = rectangle.left - 10 / 9 * rectangle.x_velocity; //Reverses the position update

					let object_displacement_slope = (last_bottom - rectangle.top) / (last_left - rectangle.right); //Gets the slope that is key to identify if the object goes on top or on the side

					console.log("object slope is" + object_displacement_slope);
					console.log("rectangle slope is " + rectangle_displacement_slope);

					if (object_displacement_slope > rectangle_displacement_slope) { //Side hit
						this.collision = 'left';
					}
					else { //Top hit
						this.collision = 'top';
					}

					//}
				}

		}


		//isOnTop = false;
		//collision against obstacles
		if (this.collision === 'top') {
			console.log("Top collision"); //debugging
			rectangle.jumping = true;
			rectangle.y = this.y + this.height;
			rectangle.y_velocity = 0;
		}
		else if (this.collision === 'bottom') {
			console.log("Bottom collision"); //debugging
			rectangle.jumping = false;
			rectangle.y = this.y - rectangle.height;
			isOnTop = true;
		}
		else if (this.collision === 'right') {
			console.log("Right collision"); //debugging
			rectangle.x = this.x - rectangle.width;
			rectangle.x_velocity -= 5;
		}
		else if (this.collision === 'left') {
			console.log("Left collision"); //debugging
			rectangle.x = this.x + this.width;
			rectangle.x_velocity += 5;
		}
		else if (rectangle.y != this.y - rectangle.height) {
			console.log("weird condition");
			isOnTop = false;
		}

		//detection of left wall at level 0

		if (level == 0 && rectangle.x < 0) {
			rectangle.x = 0;

			//if rectangle is going off the left of the screen
		} else if (rectangle.x < -rectangle.width && level > 0) {
			rectangle.x = w_canvas;

			level -= 1;

			//if rectangle goes past right boundary
		} else if (rectangle.x > w_canvas) {
			rectangle.x = -rectangle.width;
			level += 1;
		}

		//if rectangle is falling below floor line
		if (rectangle.y > h_canvas - h_floor - rectangle.height - 5) {
			rectangle.jumping = false;
			isOnTop = true;
			rectangle.y = h_canvas - h_floor - rectangle.height - 5;
			rectangle.y_velocity = 0;
		}

	}

}

controller = {
	left: false,
	right: false,
	up: false,
	keyListener: function (event) {
		var key_state = event.type == "keydown" ? true : false;

		switch (event.keyCode) {
			case 37: //left key
				controller.left = key_state;
				break;
			case 38: //up key
				controller.up = key_state;
				break;
			case 39: //right key
				controller.right = key_state;
				break;
		}
	}
};

function Movement_Friction_Jumping() {
	if (controller.up && rectangle.jumping == false) {
		rectangle.y_velocity = -impulse;
		rectangle.jumping = true;
	}

	if (controller.left) {
		rectangle.x_velocity -= 0.5;
	}

	if (controller.right) {
		rectangle.x_velocity += 0.5;
	}

	//Updates the rectangle position
	rectangle.x += rectangle.x_velocity;
	rectangle.y += rectangle.y_velocity;
	rectangle.x_velocity *= 0.9; //friction
	rectangle.y_velocity *= 0.9; //friction
}

function DrawMain() {
	//drawing the main scenario
	context.fillStyle = "#202020";
	context.fillRect(0, 0, w_canvas, h_canvas);
	context.fillStyle = "#ff0000"; //hex for red
	context.beginPath();
	context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	context.fill();
	context.strokeStyle = "#207830"; //hex for green
	context.lineWidth = 10;
	context.beginPath();
	context.moveTo(0, h_canvas - h_floor);
	context.lineTo(w_canvas, h_canvas - h_floor);
	context.stroke();
}

function Gravity() {
	rectangle.y_velocity += 1.5;
}

//obstacles per level
switch (level) {
	case 0:
		for (var i = 0; i < 5; i++) {
			obsArray.push(new obs(w_canvas / 5.4 + 140 * i, h_canvas / 1.3 - 50 * i, 100, 30, "#af4112"));
		}
		obsArray.push(new obs(600, 120, 15, 76, "grey"));

		break;
	case 1:

		break;

}

loop = function () {

	if (isOnTop == false) {
		Gravity();
	}

	DrawMain();
	Movement_Friction_Jumping();
	obsArray.forEach(obs => obs.drawObs());
	obsArray.forEach(obs => obs.collisionDetection());



	//show level on screen
	context.fillStyle = "#ffffff";
	context.font = "25px Arial";
	context.fillText("Level " + level, w_canvas - 120, 40);
	context.fillText(
		"Coord: " + parseInt(rectangle.x) + " " + parseInt(rectangle.y),
		w_canvas - 400,
		80
	); //debugging

	//call update when the browser is ready to draw again
	window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
