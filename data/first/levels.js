var functions = [Level0, Level1, Level2, Level3, Level4, Level5, Level6, Level7];
//var functions = []; // For development

function GetObstacles() {
    //obstacles per level
    obsArray = [];
    if (level >= functions.length) {
        obsArray.push(new obs(0, 0, 10, 10));
    }
    else {
        functions[level].call();
    }
}

function Level0() {
    obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
}

function Level1() {
    for (var i = 0; i < 5; i++) {
        obsArray.push(new obs(w_canvas / 5.4 + 140 * i, h_canvas / 1.3 - 50 * i, 100, 30, "#af4112"));
    }
    obsArray.push(new checkpoint(600, 120, 15, 76));

}

function Level2() {
    obsArray.push(new obs(100, 300, 30, 400));
    obsArray.push(new obs(100, 0, 30, 200));
    obsArray.push(new obs(200, 200, 50, 20));
    obsArray.push(new obs(300, 100, 50, 20));
    obsArray.push(new restarter(150, 400, 200, 20));
    obsArray.push(new restarter(350, 250, 100, 20));
    obsArray.push(new restarter(500, 250, 100, 20));
    obsArray.push(new checkpoint(600, 350, 15, 70));
}

function Level3() {
    for (let i = 0; i < 4; i++) {
        obsArray.push(new restarter(100 + i * 125, h_canvas - 32, 70, 5));
        obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
    }
}


function Level4() {
    for (let i = 0; i < 4; i++) {
        obsArray.push(new restarter(110 + i * 110, h_canvas - 32, 65, 5));
        obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
    }
}

function Level5() {
    obsArray.push(new obs(110, 50, 30, 500));
    for (let i = 0; i < 70; i++) {
        obsArray.push(new restarter(180 + i * 2.8, 60 + i * 5, 10, 2))
        obsArray.push(new restarter(190 + i * 2.8, 60 + i * 5, 10, 2));
    }
    obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
}

function Level6() {
    obsArray.push(new obs(110, 100, 30, 300));
    for (let i = 0; i < 60; i++) {
        obsArray.push(new restarter(140 + i * 1.5, 62 + i * 5, 10, 3))
        obsArray.push(new restarter(220 + i * 1.5, 62 + i * 5, 10, 3));
    }
    obsArray.push(new restarter(200, h_canvas - 32, 65, 5));
    obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
}

function Level7() {

    obsArray.push(new obs(110, 100, 30, 300));
    for (let i = 0; i < 40; i++) {
        obsArray.push(new restarter(140 + i * 1.5, 62 + i * 5, 10, 3))
        obsArray.push(new restarter(220 + i * 1.5, 62 + i * 5, 10, 3));
    }
    for (let i = 40; i < 60; i++) {
        obsArray.push(new restarter(140 + i * 1.5, 62 + i * 5, 10, 3));
    }
    obsArray.push(new restarter(200, h_canvas - 32, 65, 5));
    obsArray.push(new restarter(325, h_canvas - 32, 65, 5));
    obsArray.push(new checkpoint(w_canvas - 50, h_canvas - 80, 20, 50));
}