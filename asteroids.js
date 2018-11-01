var player, controller;
var w_canvas = 800;
var h_canvas = 500;

var gameover = false;
var difficulty = 5;
var last_time;
var score_multiplier = 0.2;
var score = 0;
var total_score = 0;
var total_score_width;

var asteroids = [];
var asteroids_initial = 20;
var asteroids_destroyed = 0;
var asteroids_bonus = 1000; //Gives 1000 for each asteroid destroyed

var bullets = [];

context = document.querySelector("canvas").getContext("2d");
context.canvas.width = w_canvas;
context.canvas.height = h_canvas;

player = {
    x: w_canvas / 2,
    y: h_canvas / 2,
    x_velocity: 0,
    y_velocity: 0,
    velocity: 0,
    max_velocity: 4,

    turning_speed: 5 / 360 * 2 * Math.PI, //Affects the speed with which the player turns
    forward_speed: 0.3,
    bullet_speed: 5, //Affects the speed of the bullets
    bullet_size: 2,

    velocity_direction: 0,
    direction: 0, //Angle between 0 and 2PI

    player_wingspan: 16,
    player_height: 16,
    player_hitbox: 5,

    print: function () {
        context.fillStyle = "#0000ff";

        //Draws the player
        context.translate(player.x, player.y); //Makes the coords relative to the center of the player
        context.rotate(player.direction); //Rotates the path that is going to be made
        context.beginPath();
        context.lineTo(-player.player_wingspan / 2, player.player_height / 2);
        context.lineTo(0, -player.player_height / 2);
        context.lineTo(player.player_wingspan / 2, player.player_height / 2);
        context.lineTo(0, player.player_height / 4);
        context.lineTo(-player.player_wingspan / 2, player.player_height / 2);
        context.fill();
        context.rotate(-player.direction); //Cancels the rotation
        context.translate(-player.x, -player.y); //Makes the coords absolute again
    },

    movement: function () {
        //console.log("movement", player.x + " " + player.y);
        if (controller.forward) {
            let last_y_velocity = player.velocity * -Math.cos(player.velocity_direction);
            let last_x_velocity = player.velocity * Math.sin(player.velocity_direction);
            let now_y_velocity = player.forward_speed * -Math.cos(player.direction);
            let now_x_velocity = player.forward_speed * Math.sin(player.direction);
            let y_velocity = last_y_velocity + now_y_velocity;
            let x_velocity = last_x_velocity + now_x_velocity;

            //console.log(last_x_velocity, last_y_velocity, now_x_velocity, now_y_velocity, x_velocity, y_velocity);

            player.velocity = Math.sqrt(Math.pow(x_velocity, 2) + Math.pow(y_velocity, 2));

            //Gets the direction from the tan using the atan2 function
            player.velocity_direction = Math.atan2(y_velocity, x_velocity) + Math.PI / 2;

        }

        if (controller.left) {
            player.direction -= player.turning_speed;
            if (player.direction < 0) {
                player.direction += 2 * Math.PI;
            }
        }

        if (controller.right) {
            player.direction += player.turning_speed;
            if (player.direction > 2 * Math.PI) {
                player.direction -= 2 * Math.PI;
            }
        }

        player.y_velocity = player.velocity * -Math.cos(player.velocity_direction);
        player.x_velocity = player.velocity * Math.sin(player.velocity_direction);

        if (player.velocity > player.max_velocity) {
            player.velocity -= player.forward_speed; //Friction to prevent infinite growth
        }

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
        var shooting_state = event.type == "keyup" ? true : false;

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
            case 32: //Space key
                if (shooting_state && !gameover) bullets.push(new Bullet(player.x, player.y, player.direction));
                console.log(bullets);
                break;
        }
    }

}

class Asteroid {

    constructor(x, y, velocity, direction, size) {

        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.size = size;
        this.size_multiplier = 5;
        this.y_velocity = velocity * -Math.cos(direction)
        this.x_velocity = velocity * Math.sin(direction);
    }

    get direction() {
        return Math.atan2(this.y_velocity, this.x_velocity) + Math.PI / 2;
    }

    print() {
        context.fillStyle = "#1f180c";
        context.beginPath();
        context.arc(this.x, this.y, this.size * this.size_multiplier, 0, 2 * Math.PI);
        context.fill();
    }

    movement() {
        this.x += this.x_velocity;
        this.y += this.y_velocity;
    }

    outofbondaries() {
        if (this.x_velocity > 0 && this.x > w_canvas) return true;
        if (this.x_velocity < 0 && this.x < 0) return true;
        if (this.y_velocity < 0 && this.y < 0) return true;
        if (this.y_velocity > 0 && this.y > h_canvas) return true;
    }

    collision(x, y, size) {

        //Coordinates of the vector between the asteroid and the object checking the collision with
        x = x - this.x;
        y = y - this.y;

        let distance = Math.sqrt(x * x + y * y);
        if (distance < (this.size * this.size_multiplier + size)) { //There as a collision
            return true;
        }
    }
}

class Bullet {

    constructor(x, y, direction) {
        this.x = x;
        this.y = y;

        //Adds the player velocity because they are moving as a whole
        this.y_velocity = player.bullet_speed * -Math.cos(direction) + player.y_velocity;
        this.x_velocity = player.bullet_speed * Math.sin(direction) + player.x_velocity;
    }

    print() {
        context.fillStyle = "#ff0000";
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

function CalcAsteroids() {
    for (var asteroid of asteroids) {

        var trash = false; //Defines if the asteroid is going to be destroyed

        asteroid.movement();
        asteroid.print();

        //Check for collision with the player
        let collided = asteroid.collision(player.x, player.y, player.player_hitbox);
        if (collided) {
            gameover = true;
            total_score = score + asteroids_destroyed * asteroids_bonus;
            context.font = "25px Arial";
            total_score_width = context.measureText(total_score).width; //Measures the width of the text - used to center the score
        }

        //Check for collision with bullets
        let destroyed = false;
        for (var bullet of bullets) {
            destroyed = destroyed || asteroid.collision(bullet.x, bullet.y, player.bullet_size);
            if (destroyed) {//If there was a collision there is no need to check other bullets for the same asteroid
                let i = bullets.indexOf(bullet);
                bullets.splice(i, 1); //Deletes the bullet from the array
                break; //There is no need to check the other bullets
            }
        }

        //Check if the asteroid has left the screen
        let outofbonds = asteroid.outofbondaries();

        if (outofbonds) { //Adds a new asteroid after one got out of the screen

            RecreateAsteroid(asteroid);
        }
        if (destroyed) { //Splits the asteroids after one was destroyed

            asteroids_destroyed++;

            if (asteroid.size > 1) { //It is not the smallest asteroid
                //console.log("fullfilled");
                //console.log(asteroid.direction);
                let asteroid1 = new Asteroid(asteroid.x, asteroid.y, asteroid.velocity, asteroid.direction + Math.PI / 6, asteroid.size - 1);
                let asteroid2 = new Asteroid(asteroid.x, asteroid.y, asteroid.velocity, asteroid.direction - Math.PI / 6, asteroid.size - 1);
                let idx = asteroids.indexOf(asteroid);
                if (idx !== -1) {
                    asteroids[idx] = asteroid1;
                    asteroids.push(asteroid2);
                }
            }
            else { //The asteroid got totally destroyed
                RecreateAsteroid(asteroid);
            }

        }
    }
}

function RecreateAsteroid(asteroid) { //An asteroid needs to be remade
    let idx = asteroids.indexOf(asteroid);
    if (idx !== -1) {
        //console.log("new one needed");
        let size = CalcSize();
        let velocity = CalcVelocity();
        asteroid = CreateAsteroid(size, velocity);
        //console.log("asteroid");
        asteroids[idx] = asteroid;
        //console.log(asteroids[idx]);
    }
}

function CalcBullets() {
    for (var bullet of bullets) {
        bullet.print();
        bullet.movement();


        let trash = bullet.outofboundaries();
        if (trash) {

            //Adds a new bullet after one got out of the screen
            let idx = bullets.indexOf(bullet);
            if (idx !== -1) {
                bullets.splice(idx, 1);
                //console.log(bullets);
            }
        }
    }
}

function InitialAsteroids() {
    //Create the initial ammount of Asteroids
    for (var i = 0; i < asteroids_initial; i++) {
        let asteroid = CreateAsteroid();
        asteroids.push(asteroid);
    }
}
//console.log("all good");

function loop() {

    //Background
    context.fillStyle = "#000000";
    context.fillRect(0, 0, w_canvas, h_canvas);

    //console.log(player.direction);

    if (!gameover) {
        //Player calculation
        player.movement();
        player.print();

        //Score
        let this_time = new Date();
        score += parseInt((this_time - last_time) * score_multiplier);
        last_time = this_time; //Updates the time

        //Instant Score Print
        context.fillStyle = "#ffffff";
        context.font = "10px Arial";
        context.fillText(score, w_canvas - 50, 20, 50);

    }
    else {

        //Final Score Print
        context.fillStyle = "#ffffff";
        context.font = "25px Arial";
        context.fillText(total_score, w_canvas / 2 - total_score_width / 2, h_canvas / 2);

    }

    CalcBullets();
    CalcAsteroids();
    CalcLevel();

    window.requestAnimationFrame(loop);
}

function CreateAsteroid(size = 1, velocity = 1) {

    let outside_angle = Math.random() * 2 * Math.PI; //Defines the position from where the asteroid starts from
    let inside_angle = Math.random() * 2 * Math.PI; //Defines the position where the asteroid heads to

    //The constants multiplied by define the "radius" of where we are coming from
    //Makes so we come from outside the screen
    let outside_x = w_canvas / 2 + Math.sin(outside_angle) * 550;
    let outside_y = h_canvas / 2 + -Math.cos(outside_angle) * 400;

    //The constants multiplied by define the "radius" of where we are going to
    //Makes so we have almost all paths in the screen
    let inside_x = w_canvas / 2 + Math.sin(inside_angle) * 350;
    let inside_y = h_canvas / 2 + -Math.cos(inside_angle) * 300;

    //Gets the displacement
    let movement_x = inside_x - outside_x;
    let movement_y = inside_y - outside_y;


    //Calculates the angle given the displacement from the tan using the atan2 function
    let angle = Math.atan2(movement_y, movement_x) + Math.PI / 2;

    //console.log("outside", outside_angle, "inside", inside_angle, "outx", outside_x, "outy", outside_y, "inx", inside_x, "iny", inside_y, "movx", movement_x, "movy", movement_y, "angle", angle);

    return new Asteroid(outside_x, outside_y, velocity, angle, size);

}

function CalcLevel() {
    let max_asteroids = asteroids_initial + Math.floor(score / 10000) * difficulty; //Each 10000 points will have "difficulty" more asteroids in game
    while (asteroids.length < max_asteroids) {
        //console.log("increasing");
        let size = CalcSize();
        let velocity = CalcVelocity();
        let asteroid = CreateAsteroid(size, velocity);
        asteroids.push(asteroid);

    }
}

function CalcSize() {
    let max_size = Math.log((score + 1000) / 1000); //The max size of the asteroid is based of the score
    return Math.floor(Math.random() * max_size) + 1;
}

function CalcVelocity() {
    let max_velocity = (Math.log((score + 500) / 500) + 2) / 2; //the max velocity of the asteroid is based on the score
    return Math.floor(Math.random() * max_velocity) + 1;
}

InitialAsteroids();
last_time = new Date();//Gets the time as soon as possible before starting the game
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);