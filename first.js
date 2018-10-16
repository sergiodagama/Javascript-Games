var context, controller, rectangle, loop;
var h_canvas = 450, w_canvas = 650;
var gravity = 30, h_floor = 25;
var level_up = false, level_down = false;
var level = 0, max_obstacles = 5, obs_width = 100;
var obs_x = new Array(); 
var obs_y = new Array();
var endObs = false;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = h_canvas;
context.canvas.width = w_canvas;

rectangle = {

  height:32,
  jumping:true,
  width:32,
  x: (w_canvas / 10), //starting point
  x_velocity:0,
  y:0,
  y_velocity:0

};

controller = {

  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

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
loop = function() {

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
  }else if (rectangle.x < -32 && level > 0) { // if rectangle is going off the left of the screen 

    rectangle.x = w_canvas;
    level_down = true;
    level -= 1;

  } else if (rectangle.x > w_canvas) {// if rectangle goes past right boundary

    rectangle.x = -32;
    level_up = true;
    level += 1;
  }
  
  
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
  var i;
  for (i = 0; i < max_obstacles; i++){
      obs_x[i] = (120 + (100*i));
      obs_y[i] = (300 - (50*i));
      context.fillRect(obs_x[i], obs_y[i], obs_width, 20);
  }
  //Collision detection for obstacles
/*  for (i = 0; i < max_obstacles; i++){
      if (rectangle.x >= obs_x[i] && rectange.x <= (obs_x[i] + obs_width) && rectangle.y <= (obs_y[i] + 20)){
          rectangle.jumping = false;
          rectangle.y = obs_y[i] + 20;
          rectangle.y_velocity = 0;
      }
  }*/
  //show level on screen 
  context.fillStyle = "#ffffff";
  context.font = "25px Arial";
  context.fillText("Level " + level, w_canvas-120, 40);
  context.fillText("Coord: " + rectangle.x + " " + rectangle.y, w_canvas-400, 80);
  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);