var player, controller;
var w_canvas = 800;
var h_canvas = 500;

context = document.querySelector("canvas").getContext("2d");
context.canvas.width = w_canvas;
context.canvas.height = h_canvas;

player = {
    x: w_canvas/2,
    y: h_canvas/2,
    x_velocity: 0,
    y_velocity: 0,
    velocity: 0,

    turning_speed: 5/360 * 2*Math.PI, //Affects the speed with which the player turns
    forward_speed: 10,
    direction: 0, //Angle between 0 and 2PI

    player_wingspan: 16,
    player_height: 16,

    print: function(){
        context.fillStyle = "#0000ff";

        //Draws the player
        context.translate(player.x, player.y); //Makes the coords relative to the center of the player
        context.rotate(player.direction); //Rotates the path that is going to be made
        context.beginPath();
        context.lineTo(-player.player_wingspan/2, player.player_height/2);
        context.lineTo(0, -player.player_height/2);
        context.lineTo(player.player_wingspan/2, player.player_height/2);
        context.lineTo(0, player.player_height/4);
        context.lineTo(-player.player_wingspan/2, player.player_height/2);
        context.fill();
        context.rotate(-player.direction); //Cancels the rotation
        context.translate(-player.x, -player.y); //Makes the coords absolute again
    },

    movement: function(){
        console.log("movement", player.x + " " + player.y);
        if(controller.forward) player.velocity += player.forward_speed;
        if(controller.left){
            player.direction -= player.turning_speed;
            if(player.direction < 0){
                player.direction += 2*Math.PI;
            }
        }
        if(controller.right) {
            player.direction += player.turning_speed;
            if(player.direction > 2*Math.PI){
                player.direction -= 2*Math.PI;
            }
        }
    
        player.y_velocity = player.velocity * -Math.cos(player.direction);
        player.x_velocity = player.velocity * Math.sin(player.direction);

        player.velocity *= 0.1; //Friction to prevent infinite growth
    
        player.x = (player.x + w_canvas + player.x_velocity) % w_canvas;
        player.y = (player.y + h_canvas + player.y_velocity) % h_canvas;
    }


}


controller = {

    forward: false,
    left: false,
    right: false,
    shooting: false,

    keyListener: function (event) {
        var key_state = event.type == "keydown" ? true : false;

		switch (event.keyCode) {
			case 65: //a key
                controller.left = key_state;
				break;
			case 87: //w key
				controller.forward = key_state;
				break;
			case 68: //d key
				controller.right = key_state;
				break;
        }
    }
    
}



function loop(){
    context.fillStyle = "#000000";
    context.fillRect(0,0,w_canvas, h_canvas);

    console.log(player.direction);

    player.movement();
    player.print();

    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);