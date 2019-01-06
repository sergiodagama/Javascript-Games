var canvas, context;
var w_canvas = 800, h_canvas = 400;

var FPS = 60;
var timeout = 1000 / FPS;

var player, controller, mother, enemy, entities = [];

var path = '';
var extension = '';
var link = ["https://cdn.glitch.com/b275ef3e-4b0a-450d-afb8-353e303a2835%2Fenemy.png?1546451061509",
            "https://cdn.glitch.com/b275ef3e-4b0a-450d-afb8-353e303a2835%2Fmother.png?1546451061675",
            "https://cdn.glitch.com/b275ef3e-4b0a-450d-afb8-353e303a2835%2Fplayer.png?1546451061626"];

var images = [];
var loaded = false;

canvas = document.querySelector("canvas");
context = canvas.getContext("2d");
context.canvas.width = w_canvas;
context.canvas.height = h_canvas;


mother = {
    width: 50,
    height: 30,
    hp: 1,
    shot_speed: 2,
    speed: 2,
    difficulty: 3,
    movement_difficulty: 0.5,
    spawning_difficulty: 2, //0.5
    spawning_ratio: 0.9
}

enemy = {
    width: 30,
    height: 30,
    hp: 30,
    shot_speed: 1,
    difficulty: 0.1,
    grid: [],
    grid_x: 9,
    grid_y: 5,
    grid_spacing: 10,
    grid_top: 60
}

player = {
    gameover: false,
    win: false,
    width: 20,
    height: 10,
    hp: 15,
    shot_speed: 5,
    speed: 5,
}

var bar = {
    border: 2,
    width: 20,
    height: h_canvas - 40
}

controller = {

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
            case 68: //d key
                controller.right = key_state;
                break;
            case 32: //Space key
                if (shooting_state && !player.gameover) controller.shooting = true;
                break;
            case 13:
                if ((player.gameover || player.win) && !key_state) Initialize();
        }

    }

}

class obj {

    constructor(x, y, width, height, hp, image, direction = 1, shot_speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;
        this.image = image;
        this.direction = direction;
        this.shots = [];
        this.shot_speed = shot_speed;
    }

    print() {
        context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    shoot() {
        for (let shot of this.shots) {
            if (shot.out()) { //The shot has gone out of bounds
                let index = this.shots.indexOf(shot);
                if (index != -1) {
                    this.shots.splice(index, 1);
                }
            }
            else {
                shot.movement();
                shot.print();
            }

        }
    }

    newshot() {
        let new_shot = new Shot(this.x, this.y, this.direction, this.shot_speed);
        this.shots.push(new_shot);
    }

    hit(x, y) {
        if (x > this.x - this.width / 2 && x < this.x + this.width / 2 && y > this.y - this.height / 2 && y < this.y + this.height / 2) {
            this.hp--;
            if (this.hp == 0) { //Obj died

                if(this == player.player){ //The enemy is the player
                    player.gameover = true;
                }

                else if (this != mother.mother) { //The object was a normal enemy
                    //Removes it from the grid of enemies
                    for (let i = 0; i < enemy.grid_x; i++) {
                        for (let j = enemy.grid_y - 1; j >= 0; j--) {
                            let coords = gridToCoord(i, j);
                            let absx = coords.x;
                            let absy = coords.y;
                            if (this.x == absx && this.y == absy) {
                                enemy.grid[j][i] = 0;
                                i = enemy.grid_x;
                                j = -1;
                            }
                        }
                    }
                }

                else { //The enemy is the mother
                    player.win = true;
                }

                //Removes it from the entities
                let index = entities.indexOf(this);
                if (index != -1) {
                    entities.splice(index, 1);
                }
            }
            return true;
        }
    }

}

class Shot {
    constructor(x, y, direction, speed) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.direction = direction;
        this.speed = speed;
    }

    movement() {
        this.y += this.speed * this.direction;

    }

    print() {
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    }

    out() {
        if (this.y < 0 || this.y > h_canvas) return true;
    }
}

class Enemy extends obj {
    constructor(x, y, width, height, hp, image, shot_speed, difficulty) {
        super(x, y, width, height, hp, image, 1, shot_speed);
        this.difficulty = difficulty;
    }

    newshot() {
        let chance = Math.random() * 100;
        if (chance < this.difficulty) {
            super.newshot();
        }

    }
}

class Player extends obj {

    constructor(image) {
        super(w_canvas / 2, h_canvas - 50, player.width, player.height, player.hp, image, -1, player.shot_speed);
    }

    movement() {
        if (controller.left && this.x > 100) {
            console.log('is going left')
            this.x -= player.speed;
        }
        if (controller.right && this.x < w_canvas - 100) {
            console.log('is going right');
            this.x += player.speed;
        }
    }

    newshot() {
        if (controller.shooting) {
            controller.shooting = false;
            this.shots.push(new Shot(this.x, this.y, this.direction, this.shot_speed));
        }
    }


}

class Mother extends Enemy {
    constructor(image) {
        super(w_canvas / 2, 30, mother.width, mother.height, mother.hp, image, mother.shot_speed, mother.difficulty);
        this.goal_x = this.newgoal()
    }

    spawn() {
        if(player.win) return //If the player has already won,the mother is dead so won't be able to spawn more enemies
        let enemy_number = entities.length - 2;
        if (enemy_number < enemy.grid_x * enemy.grid_y * mother.spawning_ratio) { //We have less enemies than the ones we want


            let chance = Math.random() * 100;
            if (chance < mother.spawning_difficulty) { //We will create a new enemy
                console.log('should be creating');

                for (let j = 0; j < enemy.grid_y; j++) {
                    for (let i = 0; i < enemy.grid_x; i++) {
                        if (enemy.grid[j][i] == 0) { //we found an empty spot

                            let coords = gridToCoord(i, j);
                            let absx = coords.x;
                            let absy = coords.y;

                            let new_enemy = new Enemy(absx, absy, enemy.width, enemy.height, enemy.hp, enemy.image, enemy.shot_speed, enemy.difficulty);
                            entities.push(new_enemy);
                            enemy.grid[j][i] = 1;

                            i = enemy.grid_x;
                            j = enemy.grid_y;

                        }
                    }
                }
            }

        }
    }

    movement() {

        //console.log(this.goal_x);
        let differece = this.goal_x - this.x;
        if (Math.abs(differece) > mother.speed) {
            let multiplier = (this.goal_x > this.x) ? 1 : -1
            this.x += multiplier * mother.speed;
        }

        else {
            let chance = Math.random() * 100;
            if (chance < mother.movement_difficulty) {
                this.goal_x = this.newgoal();
            }
        }
    }

    newgoal() {
        return Math.floor(w_canvas / 4 + Math.random() * w_canvas / 2);
    }
}

function drawMain() {

    context.fillStyle = "#000000";
    context.fillRect(0, 0, w_canvas, h_canvas);

}

function drawStats() {

    context.lineWidth = bar.border;

    //Mother
    let hp_percentage = mother.mother.hp / mother.hp; //Percentage of Mother's hp

    context.strokeStyle = "#ff0000"
    context.strokeRect(w_canvas - 10 - bar.border * 2 - bar.width, 10, bar.border * 2 + bar.width, bar.height + bar.border * 2)

    context.fillStyle = "#ff0000";
    context.fillRect(w_canvas - 10 - bar.width - bar.border, 10 + bar.border + (1 - hp_percentage) * bar.height, bar.width, hp_percentage * bar.height);


    //Player
    hp_percentage = player.player.hp / player.hp //Percentage of Player's hp

    context.strokeStyle = "#00ff00";
    context.strokeRect(10, 10, 2 * bar.border + bar.width, bar.height + bar.border * 2);

    context.fillStyle = "#00ff00";
    context.fillRect(10 + bar.border, 10 + bar.border + (1 - hp_percentage) * bar.height, bar.width, hp_percentage * bar.height);

}
function loadImages(number = 0) {
    if (number == link.length) {
        return true;
    }
    else {
        let newImg = new Image();
        newImg.src = path + link[number] + extension;
        newImg.onload = function () {
            images.push(newImg);
            loadImages(++number);
        }
    }
}

function calcPlayerShots() {
    for (let shot of player.player.shots) {
        for (let entity of entities) {
            if (entity != player.player) {
                let hit = entity.hit(shot.x, shot.y);
                if (hit) {
                    let index = player.player.shots.indexOf(shot);
                    if (index != -1) {
                        player.player.shots.splice(index, 1);
                    }
                }
            }
        }
    }
}

function calcAlienShots() {
    for (let entity of entities) {
        if (entity != player.player) {
            for (let shot of entity.shots) {
                let hit = player.player.hit(shot.x, shot.y);
                if (hit) {
                    let index = entity.shots.indexOf(shot);
                    if (index != -1) {
                        entity.shots.splice(index, 1);
                    }
                }
            }
        }
    }
}

function gridToCoord(x, y) {
    let length = enemy.width * enemy.grid_x + enemy.grid_spacing * (enemy.grid_x - 1);
    let left = w_canvas / 2 - length / 2 + enemy.width / 2;
    let top = enemy.grid_top + enemy.height / 2;

    let abs_x = left + x * (enemy.width + enemy.grid_spacing);
    let abs_y = top + y * (enemy.height + enemy.grid_spacing);
    return { x: abs_x, y: abs_y };
}

function createEnemies() {

    enemy.grid = [];
    for (let i = 0; i < enemy.grid_y; i++) {
        enemy.grid.push(new Array(enemy.grid_x).fill(1));
    }

    for (let i = 0; i < enemy.grid_x; i++) {
        for (let j = 0; j < enemy.grid_y; j++) {
            let coords = gridToCoord(i, j)
            let new_enemy = new Enemy(coords.x, coords.y, enemy.width, enemy.height, enemy.hp, enemy.image,
                enemy.shot_speed, enemy.difficulty);
            entities.push(new_enemy);
        }
    }
}

function Initialize() {
    entities = [];

    player.gameover = false;
    player.win = false;
    player.player = new Player(player.image);
    mother.mother = new Mother(mother.image);
    entities.push(player.player, mother.mother);

    createEnemies();
}

function main() {

    setInterval(function () {

        drawMain();
        drawStats();

        for (let entity of entities) {
            entity.print();
            entity.shoot();
            entity.newshot();
        }

        if (player.win) { //If the player has killed the mother ship
            if (entities.length > 1) { //If there are still enemies
                entities.splice(-1, 1);
            }
            else {
            }
        }

        if (!player.gameover) {
            console.log('is playing');
            calcPlayerShots();
            calcAlienShots();

            player.player.movement();
            mother.mother.movement();
            mother.mother.spawn();
        }

    }, timeout)
}

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

loadImages();
let interval = setInterval(function () {
    if (images.length == link.length) { //Ended loading
        clearInterval(interval);
        //Sets the right images
        mother.image = images[1];
        player.image = images[2];
        enemy.image = images[0];

        console.log("Images Loaded");

        Initialize();

        main();
    }

}, timeout);