var context, controller, loop;
var h_canvas = 600, w_canvas = 400;
var vertical_tiles = 4; //How many tiles are shown vertically
var horizontal_tiles = 4; //How many tiles are shown horizontally
var tiles = [];

var w_tiles = w_canvas / horizontal_tiles; //Width of each tile
var h_tiles = h_canvas / vertical_tiles; //Height of each tile

var gameover = false;

//Initialize the tiles
for (var i = 0; i < vertical_tiles; i++) {
    tiles[i] = Math.floor(Math.random() * horizontal_tiles);
}
console.log(tiles);

//Initialize canvas
context = document.querySelector("canvas").getContext("2d");
context.canvas.height = h_canvas;
context.canvas.width = w_canvas;

//Controller declaration
controller = {

    tile: undefined,
    date: Date(), //Gets the date
    level: 1,
    timestarted: undefined, //The time (in milliseconds)
    timeoflevel:0, //Time that the level takes
    lastfps: 0,
    fps: 0,
    score: 0,

    keyListener: function (event) {

        if (event.type == "keyup") {

            switch (event.keyCode) {

                case 65: //a
                    controller.tile = 0;
                    RandomizeTiles();
                    break;
                case 83: //s
                    controller.tile = 1;
                    RandomizeTiles();
                    break;
                case 68: //d
                    controller.tile = 2;
                    RandomizeTiles();
                    break;
                case 70: //f
                    controller.tile = 3;
                    RandomizeTiles();
                    break;

            }
        }

    }

};

loop = function () {

    DrawMain();
    DrawTiles();
    DrawBorders();
    DrawScore();
    DrawFPS();

    window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

function DrawMain() {

    //Background color
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, w_canvas, h_canvas);// x, y, width, height

}

function DrawTiles() {

    if (!gameover) {
        context.fillStyle = "#000000";
        for (var i = 0; i < vertical_tiles; i++) {
            let x1 = tiles[i] * w_tiles;
            let y1 = h_canvas - h_tiles * (i + 1);
            context.fillRect(x1, y1, w_tiles, h_tiles);
        }
    }
    else {
        context.fillStyle = "#ff0000"
        for (var i = 0; i < vertical_tiles; i++) {
            let x1 = tiles[i] * w_tiles;
            let y1 = h_canvas - h_tiles * (i + 1);
            context.fillRect(x1, y1, w_tiles, h_tiles);
        }

        context.font = "25px Arial";
        context.fillStyle = "#000000";
        context.fillText("Game Over", w_canvas / 2 - 60, h_canvas / 2);

        DrawBorders();
    }
}

function RandomizeTiles() {//Moves the tiles down inside the array and adds a new one
    if (controller.tile === tiles[0] && !gameover) { //The player has pressed the right key

        controller.score++;
        for (var i = 0; i < vertical_tiles - 1; i++) {
            tiles[i] = tiles[i + 1];
        }
        tiles[vertical_tiles - 1] = Math.floor(Math.random() * horizontal_tiles);
        window.requestAnimationFrame(loop);
    }
    else {
        gameover = true;
        window.requestAnimationFrame(loop);

    }

}

function DrawBorders() {

    //Border
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w_canvas, 0);
    context.lineTo(w_canvas, h_canvas);
    context.lineTo(0, h_canvas);
    context.lineTo(0, 0);
    context.stroke();
}

function DrawScore() {

    context.fillStyle = "#00ff00"
    context.font = "25px Arial";
    context.fillText("Score:" + controller.score, 10, 50);

}

function DrawFPS() {

    context.fillStyle = "#00ff00"
    context.font = "10px Arial";

    if (Date() === controller.date) {
        controller.fps++;
    }
    else {
        controller.lastfps = controller.fps;
        controller.fps = 0;
        controller.date = Date();
    }

    context.fillText(controller.lastfps, w_canvas - 50, 20);
}

function CalculateLevel(){

    var leveltime = (20*level + 1000)/level; //Inverse function that gives me the time for each level (in seconds)
    var leveltime_milliseconds = leveltime * 1000;
    controller.timeoflevel = leveltime_milliseconds;
 
}



