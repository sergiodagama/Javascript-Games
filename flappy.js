var context, h_canvas = 400, w_canvas = 800;
var FPS = 60, timeout = 1000 / FPS;

context = document.querySelector("canvas").getContext("2d");
context.canvas.width = w_canvas;
context.canvas.height = h_canvas;

var pipe = {
    pipes: [],
    gap: 150,
    pipe_border_distance: 100,
    pipe_distance: 150,
    x_velocity: 2,
    width: 20,
}

var flappy = {
    x: 100,
    y: h_canvas / 2,
    size: 5,
    y_velocity: 0,
    gravity: 0.4,
    impulse: 5,
    in_range: false,
    gameover: false,
    score: 0,
    gameover_text: "Game over. ENTER to restart",

    Draw: function () {
        context.fillStyle = "#ffff00";
        context.beginPath();
        context.arc(flappy.x, flappy.y, flappy.size, 0, 2 * Math.PI);
        context.fill();
    },

    Gravity: function () {
        flappy.y_velocity += flappy.gravity;
        flappy.y += flappy.y_velocity;

        if (flappy.y > h_canvas) {
            flappy.y = h_canvas - flappy.size;
            flappy.y_velocity = 0;
        }
        if (flappy.y < 0) {
            flappy.y = flappy.size;
            flappy.y_velocity = 0;
        }
    },

    Jump: function (e) {
        if (e.keyCode == 32) {
            if (flappy.y_velocity > 0) flappy.y_velocity = 0;
            flappy.y_velocity -= flappy.impulse;
        }
    }
}

class Pipe {

    constructor() {
        this.gap = pipe.gap;
        this.y = Math.floor(Math.random() * (h_canvas - 2 * pipe.pipe_border_distance - pipe.gap / 2)) + pipe.pipe_border_distance;
        //this.y = Math.floor(Math.random() * h_canvas - 2 * pipe.gap + 2*pipe.gap);
        this.x = w_canvas;
        this.x_velocity = pipe.x_velocity;
        this.width = pipe.width
    }

    Draw() {
        context.fillStyle = "#006600";
        context.fillRect(this.x - this.width / 2, 0, this.width, this.y - this.gap / 2);
        context.fillRect(this.x - this.width / 2, this.y + this.gap / 2, this.width, h_canvas - (this.y + this.gap / 2));
    }

    Movement() {
        this.x -= this.x_velocity;
        if (this.x + this.width / 2 < 0) {
            pipe.pipes.shift();
        }
    }

    Collision() {
        if (flappy.x + flappy.size >= this.x - this.width / 2 && flappy.x - flappy.size <= this.x + this.width / 2) {
            //If is in the x range of the pipe
            flappy.in_range = true;
            if (flappy.y - flappy.size < this.y - this.gap / 2 || flappy.y + flappy.size > this.y + this.gap / 2) {
                //If is not in the middle of the pipe
                flappy.gameover = true;
            }

        }
        else {
            if (flappy.in_range) {
                console.log('false');
                flappy.in_range = false;
                flappy.score++;
            }
        }
    }
}

function DrawMain() {

    var skyline = 300;

    context.fillStyle = "#0000ff";
    context.fillRect(0, 0, w_canvas, skyline);
    context.fillStyle = "#00ff00";
    context.fillRect(0, skyline, w_canvas, h_canvas - skyline);
}

function DrawScore() {
    context.font = '25px Arial'
    context.fillStyle = "#ffffff";
    context.fillText("Score: " + flappy.score, w_canvas - 200, 40);
}

function CreatePipes() {
    if (pipe.pipes[pipe.pipes.length - 1].x < w_canvas - pipe.pipe_distance) {

        pipe.pipes.push(new Pipe());
    }
}

function Restart(e) {
    if (e.keyCode == 13) {
        flappy.y = h_canvas / 2;
        flappy.y_velocity = 0;
        flappy.score = 0;
        flappy.gameover = false;

        pipe.pipes = [];
        pipe.pipes.push(new Pipe());
    }
}

function main() {

    setInterval(function () {

        DrawMain();


        CreatePipes();

        for (let a_pipe of pipe.pipes) {
            a_pipe.Draw();
            a_pipe.Movement();
        }

        if (!flappy.gameover) {
            flappy.Draw();
            flappy.Gravity();

            pipe.pipes[0].Collision();
        }
        else {
            context.fillStyle = "#ffffff";
            context.font = "25px Arial";
            let width = context.measureText(flappy.gameover_text).width;
            context.fillText(flappy.gameover_text, w_canvas / 2 - width / 2, h_canvas / 2);
        }

        DrawScore();

    }, timeout)
}

document.addEventListener('keyup', flappy.Jump);
document.addEventListener('keypress', Restart);

pipe.pipes.push(new Pipe());
main();
