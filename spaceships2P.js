//Independently developed in https://github.com/henriquecscode/spaceships2P

h_canvas = 500;
w_canvas = 900;

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = h_canvas;
context.canvas.width = w_canvas;

var FPS = 60;
var timeout = 1000 / FPS;

player = {

    turning_speed: 5 / 360 * 2 * Math.PI, //Affects the speed with which the player turns
    forward_speed: 0.3,
    bullet_speed: 5, //Affects the speed of the bullets
    bullet_size: 2,
    max_velocity: 4,

    player_wingspan: 16,
    player_height: 16,
    player_hitbox: 5,
}



class Controller {
    constructor() {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.shooting = false;
    }

}

class Bullet {

    constructor(x, y, direction, x_velocity, y_velocity, color) {

        this.x = x;
        this.y = y;

        //Adds the player velocity because they are moving as a whole
        this.y_velocity = player.bullet_speed * -Math.cos(direction) + y_velocity;
        this.x_velocity = player.bullet_speed * Math.sin(direction) + x_velocity;

        console.log(this.x, this.y);
    }

    print() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, player.bullet_size, 0, 2 * Math.PI);
        context.fill();
    }

    movement() {
        this.x += this.x_velocity;
        this.y += this.y_velocity;
    }

    outofboundaries() {
        if (this.x_velocity > 0 && this.x > w_canvas) return true;
        if (this.x_velocity < 0 && this.x < 0) return true;
        if (this.y_velocity < 0 && this.y < 0) return true;
        if (this.y_velocity > 0 && this.y > h_canvas) return true;
    }

}

class Player {

    constructor(color) {
        this.x = 0;
        this.y = 0;
        this.velocity = 0;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.velocity_direction = 0;
        this.direction = 0; //Angle between 0 and 2PI
        this.color = color;
        this.controller = new Controller();
        this.gameover = false;
        this.initialized = false;

        this.bullets = [];
    }

    initialize() {
        this.x = Math.floor(Math.random() * w_canvas);
        this.y = Math.floor(Math.random() * h_canvas);
        this.velocity = 0;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.velocity_direction = 0;
        this.direction = 0; //Angle between 0 and 2PI
        this.bullets = [];
        this.gameover = false;
    }

    print() {
        context.fillStyle = this.color;

        //Draws the player
        context.translate(this.x, this.y); //Makes the coords relative to the center of the player
        context.rotate(this.direction); //Rotates the path that is going to be made
        context.beginPath();
        context.lineTo(-player.player_wingspan / 2, player.player_height / 2);
        context.lineTo(0, -player.player_height / 2);
        context.lineTo(player.player_wingspan / 2, player.player_height / 2);
        context.lineTo(0, player.player_height / 4);
        context.lineTo(-player.player_wingspan / 2, player.player_height / 2);
        context.fill();
        context.rotate(-this.direction); //Cancels the rotation
        context.translate(-this.x, -this.y); //Makes the coords absolute again
    }

    movement() {
        //console.log("movement", player.x + " " + player.y);
        if (this.controller.forward) {
            let last_y_velocity = this.velocity * -Math.cos(this.velocity_direction);
            let last_x_velocity = this.velocity * Math.sin(this.velocity_direction);
            let now_y_velocity = player.forward_speed * -Math.cos(this.direction);
            let now_x_velocity = player.forward_speed * Math.sin(this.direction);
            now_y_velocity = last_y_velocity + now_y_velocity;
            now_x_velocity = last_x_velocity + now_x_velocity;

            //console.log(last_x_velocity, last_y_velocity, now_x_velocity, now_y_velocity, this.x_velocity, this.y_velocity);

            this.velocity = Math.sqrt(Math.pow(now_x_velocity, 2) + Math.pow(now_y_velocity, 2));

            //Gets the direction from the tan using the atan2 function
            this.velocity_direction = Math.atan2(now_y_velocity, now_x_velocity) + Math.PI / 2;

        }

        //console.log(this.controller);
        if (this.controller.left) {
            //console.log("Turning left");
            this.direction -= player.turning_speed;
            if (this.direction < 0) {
                this.direction += 2 * Math.PI;
            }
        }

        if (this.controller.right) {
            this.direction += player.turning_speed;
            if (this.direction > 2 * Math.PI) {
                this.direction -= 2 * Math.PI;
            }
        }

        //console.log("this velocity", this.velocity);
        this.y_velocity = this.velocity * -Math.cos(this.velocity_direction);
        this.x_velocity = this.velocity * Math.sin(this.velocity_direction);

        if (this.velocity > player.max_velocity) {
            this.velocity -= player.forward_speed; //Friction to prevent infinite growth
        }

        //console.log("x and y velocities", this.x_velocity, this.y_velocity);
        this.x = (this.x + w_canvas + this.x_velocity) % w_canvas;
        this.y = (this.y + h_canvas + this.y_velocity) % h_canvas;
    }

    shooting() { //Update all of the players bullets
        for (var bullet of this.bullets) {

            bullet.print();
            bullet.movement();

            let outofbonds = bullet.outofboundaries();
            if (outofbonds) {
                {
                    //Deletes the bullet that got out of the screens
                    let idx = this.bullets.indexOf(bullet);
                    if (idx !== -1) {
                        console.log("Deleting bullet");
                        this.bullets.splice(idx, 1);
                        //console.log(bullets);
                    }
                }
            }
        }

    }

    shot(bullet_x, bullet_y) { //Check if a bullet collided with the player
        let x = this.x - bullet_x;
        let y = this.y - bullet_y;


        let distance = Math.sqrt(x * x + y * y);
        if (distance < player.player_hitbox + player.bullet_size) { //There as a collision
            return true;
        }
    }
    kill() {
        this.gameover = true;
    }
}

function main() {

    setInterval(() => {
        printMain();

        if (!red.gameover) {
            red.print();
            red.movement();
        }
        red.shooting();


        if (!green.gameover) {
            green.print();
            green.movement();
        }
        green.shooting();


        for (let bullet of green.bullets) {
            if (red.shot(bullet.x, bullet.y)) {
                red.gameover = true;
                break;
            }
        }

        for (let bullet of red.bullets) {
            if (green.shot(bullet.x, bullet.y)) {
                green.gameover = true;
                break;
            }
        }

    }, (timeout));
}

function menu() {

    printMain();

    console.log("gameovers", red.gameover, green.gameover);
    context.fillStyle = "#ffffff";
    context.font = '25px Arial';
    let intro = "Spaceships 2P";
    let intro_width = context.measureText(intro).width;
    context.fillText(intro, w_canvas / 2 - intro_width / 2, 100);

    printFirst();
    printSecond();

    let interval = setInterval(function () {
        console.log("gameovers", red.gameover, green.gameover);

        if (red.initialized) {
            context.fillStyle = '#000000';
            context.fillRect(0, h_canvas / 2 - 30, w_canvas / 2, h_canvas / 2);
            console.log("Neeed to clear");
        }
        if (green.initialized) {
            context.fillStyle = '#000000';
            context.fillRect(w_canvas / 2, h_canvas / 2 - 30, w_canvas / 2, h_canvas / 2);
            console.log("Neeed to clear");
        }
        if (green.initialized && green.initialized) { //Both players are in the game
            clearInterval(interval);
            red.initialize();
            green.initialize();
            main();
        }
    }, timeout)
}

function printMain() {

    context.fillStyle = "#000000";
    context.fillRect(0, 0, w_canvas, h_canvas);
}

function printFirst() {

    context.font = '25px Arial';
    context.fillStyle = '#ffffff';

    let first_player = ["Red:", "W, A, D, Control", "Shift to respawn"];
    for (var i = 0; i < first_player.length; i++) {
        let width = context.measureText(first_player[i]).width;
        context.fillText(first_player[i], w_canvas / 4 - width / 2, h_canvas / 2 + i * 30);
    }
}

function printSecond() {

    context.font = '25px Arial';
    context.fillStyle = '#ffffff';

    let second_player = ["Green:", "Arrow keys, Space", "Enter to respawn"];
    for (var i = 0; i < second_player.length; i++) {
        let width = context.measureText(second_player[i]).width;
        context.fillText(second_player[i], w_canvas / 4 * 3 - width / 2, h_canvas / 2 + i * 30);
    }
}

var red = new Player('#ff0000');
var green = new Player('#00ff00');

function keyListener(event) {
    var key_state = event.type == "keydown" ? true : false;
    var shooting_state = event.type == "keyup" ? true : false;

    //console.log(key_state, event.keyCode);
    switch (event.keyCode) {

        //RED
        case 65: //a key
            red.controller.left = key_state;
            break;
        case 87: //w key
            red.controller.forward = key_state;
            break;
        case 68: //d key
            red.controller.right = key_state;
            break;
        case 16: //Shift key
            if (shooting_state && !red.gameover) red.bullets.push(new Bullet(red.x, red.y, red.direction, red.x_velocity, red.y_velocity, red.color));
            console.log("red shot", red.bullets);
            break;
        case 17: //Control key
            if (red.gameover && key_state) {
                console.log("Should have restarted");
                red.initialize();
            }
            if (!red.initialized) red.initialized = true;
            break;

        //GREEN
        case 37: //left key
            green.controller.left = key_state;
            break;
        case 38: //up key
            green.controller.forward = key_state;
            break;
        case 39: //right key
            green.controller.right = key_state;
            break;
        case 32: //Space key
            if (shooting_state && !green.gameover) {

                green.bullets.push(new Bullet(green.x, green.y, green.direction, green.x_velocity, green.y_velocity, green.color));
                /*console.log("bullet is", bullet);
                console.log(green);
                console.log("x, y, direction", green.x, green.y, green.direction, green.x_velocity, green.y_velocity);
                console.log("green shot", green.bullets);*/
            }
            break;

        case 13: //Enter key
            if (green.gameover && key_state) green.initialize();
            if (!green.initialized) green.initialized = true;
            break;
    }
}

window.addEventListener("keydown", keyListener);
window.addEventListener("keyup", keyListener);
menu();