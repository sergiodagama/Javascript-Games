//Independently developed in https://github.com/henriquecscode/snake

var h_canvas = 500;
var w_canvas = 900;

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = h_canvas;
context.canvas.width = w_canvas;

var movement = 4;
var snake_growth = 5;
var FPS = 60;
var timeout = 1000 / FPS;

var gameover = false;
var gameover_text = "You lost! Score: ";
context.font = '25px Arial';
var gameover_text_width = context.measureText(gameover_text).width;

var fruit = {
    x: 0,
    y: 0,
    size: 4,

    spawn: function () {
        this.x = Math.floor(Math.random() * w_canvas);
        this.y = Math.floor(Math.random() * h_canvas);
    },

    print: function () {
        context.fillStyle = "#00ff00";
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    }
}

var snake = {
    body: [[w_canvas / 2, h_canvas / 2]],
    body_size: 5,
    body_length_for_collision: 7,

    print: function () {
        for (var body_part of this.body) {

            //console.log(body_part);
            context.fillStyle = '#ff0000';
            context.beginPath();
            context.arc(body_part[0], body_part[1], this.body_size, 0, 2 * Math.PI);
            context.fill();
        }
    },

    movement: function () {

        let head_x = this.body[0][0];
        let head_y = this.body[0][1];

        let size = this.body.length;
        let tail_x = this.body[size - 1][0];
        let tail_y = this.body[size - 1][1];

        let tail2_x = this.body[size - 1][0];
        let tail2_y = this.body[size - 1][1];

        var movement_x = 0;
        var movement_y = 0;

        switch (controller.key) {
            case 'left':
                movement_x -= movement;
                break;
            case 'right':
                movement_x += movement;
                break;
            case 'up':
                movement_y -= movement;
                break;
            case 'down':
                movement_y += movement;
                break;
        }

        //Make it go on the other side
        head_x = (head_x + w_canvas) % w_canvas;
        head_y = (head_y + h_canvas) % h_canvas;

        this.body.unshift([head_x + movement_x, head_y + movement_y]); //Move the head
        this.body.splice(-1, 1); //Mode the tail

        //Crash with snake

        let crash = false;
        for (var i = this.body_length_for_collision; i < this.body.length; i++) {
            crash = crash || this.body_collision(head_x, head_y, this.body[i][0], this.body[i][1]);
        }

        if (crash) { //There was a crash
            gameover = true;
            
            context.font = '25px Arial';
            context.fillStyle = '#ffffff';
            context.fillText(gameover_text + this.body.length, w_canvas / 2 - gameover_text_width/2, h_canvas/2 - 25/2);
        }


        //Eat fruit
        let eat = this.fruit_collision(head_x, head_y); //See if collided with a fruit
        //console.log(eat);

        if (eat) { //Ate a fruit
            this.body.push([tail_x + (tail_x - tail2_x), tail_y + (tail_y - tail2_y)]);
            fruit.spawn();
        }

    },

    fruit_collision(x, y) {

        //console.log(fruit.x, fruit.y, x, y);
        //Coordinates of the vector between the fruit and the head of the snake
        var x = fruit.x - x;
        var y = fruit.y - y;

        //console.log(x, y);
        var distance = Math.sqrt(x * x + y * y);
        if (distance < (this.body_size + fruit.size)) { //There was a collision
            return true;
        }

        //console.log('distance', distance);
    },

    body_collision: function (head_x, head_y, body_x, body_y) {
        var x = head_x - body_x;
        var y = head_y - body_y;

        var distance = Math.sqrt(x * x + y * y);
        if (distance < this.body_size + fruit.size) { //There was a collision
            return true;
        }
    }
}

var controller = {

    key: false,

    keyDown: function (event) {

        switch (event.keyCode) {
            case 37: //left key
                if (controller.key != 'right') controller.key = 'left';
                //console.log(controller.key);
                break;
            case 38: //up key
                if (controller.key != 'down') controller.key = 'up';
                //console.log(controller.key);
                break;
            case 39: //right key
                if (controller.key != 'left') controller.key = 'right';
                //console.log(controller.key);
                break;
            case 40: //down key
                if (controller.key != 'up') controller.key = 'down';
                //console.log(controller.key);
                break;
            case 13: //Enter
                if (gameover) {
                    initialize();
                }
        }

        //console.log(controller.key);
    }

}

function initialize() {
    snake.body = [[w_canvas / 2, h_canvas / 2]];
    controller.key = false;
    fruit.spawn();
    gameover = false;
}

function main() {

    setInterval(() => {

        if (!gameover) {
            printMain();
            snake.print();
            snake.movement();
            fruit.print();
        }
    }, (timeout));
}

function printMain() {

    context.fillStyle = "#000000";
    context.fillRect(0, 0, w_canvas, h_canvas);
}

window.addEventListener('keydown', controller.keyDown);

fruit.spawn();
//console.log(fruit);
main();