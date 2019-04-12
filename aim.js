var w_canvas = 800, h_canvas = 500;
var xy_canvas, x_canvas, y_canvas;
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = w_canvas;
canvas.height = h_canvas;

var clickables = [];
var configs = {
    radius: 20,
    color: '#ff0000',
    max_objects: 20,
    max_decrease: 10,
}

var player = {
    missed: 0,
    score: 0,
    time: 10000,
    start: 0,
    gameover: false,
}

Resize(); //Set initial coords of the canvas

class Clickable {
    constructor() {
        this.x = Math.random() * w_canvas;
        this.y = Math.random() * h_canvas;
        this.radius = configs.radius;
        this.lifetime = 1;
        this.creation = new Date();
    }

    print() {
        context.fillStyle = configs.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        let d = new Date();
        this.lifetime = d - this.lifetime;
    }

    decrease() {
        //Change according to change needed
        let mass = this.mass;
        mass -= (configs.max_decrease - Math.log10(this.lifetime));

        if (mass < 0) {
            player.missed++;
            player.score -= 1000; //Reduces score for every circle missed
            this.delete()
        }
        this.radius = this.massToRadius(mass);
    }

    click(x, y) {
        let vx = x - this.x;
        let vy = y - this.y;
        let square = vx * vx + vy * vy;
        let distance = Math.sqrt(square);
        if (distance <= this.radius) {
            player.score += Math.floor(this.mass);
            this.delete();
        }
    }

    delete() {
        let index = clickables.indexOf(this);
        if (index != -1) {
            clickables.splice(index, 1);
        }
    }

    get mass() {
        return this.radius * this.radius * Math.PI;
    }

    massToRadius(mass) {
        return Math.sqrt(mass / Math.PI);
    }
}

function DrawMain() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, w_canvas, h_canvas);
}

function DrawScore(d) {

    context.fillStyle = "#ffffff";
    context.font = '10px Arial';

    let text_missed = 'Missed: ' + player.missed;
    context.fillText(text_missed, w_canvas - 110, 10, 100);

    let text_score = 'Score: ' + player.score;
    context.fillText(text_score, w_canvas - 110, 25, 100);

    let time_left = player.time - (d - player.start);
    let text_time = 'Time left: ' + time_left;
    context.fillText(text_time, w_canvas - 110, 40, 100);
}

function Click(e) {
    Resize();
    x = e.pageX - x_canvas;
    y = e.pageY - y_canvas;

    for (let one_clickable of clickables) {
        one_clickable.click(x, y);
    }
}

function Resize() {

    xy_canvas = canvas.getBoundingClientRect();
    x_canvas = xy_canvas.x;
    y_canvas = xy_canvas.y;

}

function Restart(e) {
    if (e.keyCode != 13) return
    if (!player.gameover) return

    console.log("gameover trigger");
    player.gameover = false;
    player.score = 0;
    let d = new Date();
    player.start = d.getTime();

    clickables = [];
    for (let i = 0; i < configs.max_objects; i++) {
        let new_clickable = new Clickable();
        clickables.push(new_clickable);
    }
    window.requestAnimationFrame(loop);
}

function loop() {

    DrawMain();

    let d = new Date();
    d = d.getTime();
    var dif = d - player.start;
    console.log(d);
    console.log('dif', dif);

    if (dif < player.time) {
        while (clickables.length < configs.max_objects) {
            clickables.push(new Clickable());
        }

        for (let i = clickables.length; i > 0; i--) {
            let one_clickable = clickables[i - 1];
            one_clickable.decrease();
            one_clickable.print();
        }

        DrawScore(d);
        window.requestAnimationFrame(loop);
    }

    else {
        player.gameover = true;
        context.fillStyle = '#ffffff';
        context.font = '25px Arial';
        let text = "Your score was: " + player.score;
        let text2 = "Press ENTER to restart";
        let text_width = context.measureText(text).width;
        let text_width2 = context.measureText(text2).width;

        context.fillText(text, w_canvas / 2 - text_width / 2, h_canvas / 2);
        context.fillText(text2, w_canvas / 2 - text_width2 / 2, h_canvas / 2 + 30);
    }

}

for (let i = 0; i < configs.max_objects; i++) {
    let new_clickable = new Clickable();
    clickables.push(new_clickable);
}

window.addEventListener('click', Click);
window.addEventListener('resize', Resize);
window.addEventListener('keypress', Restart);
let d = new Date();
player.start = d.getTime();
console.log(player.start);
window.requestAnimationFrame(loop);