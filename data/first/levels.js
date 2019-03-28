function GetObstacles() {
	//obstacles per level
	obsArray = [];
	switch (level) {

		case 0:
			Level0();
			break;

		//Add new levels here
		case 1:
			Level1();
			break;

		default:
			obsArray.push(new obs(0, 0, 10, 10));
			break;
	}
}

function Level0() {
    for (var i = 0; i < 5; i++) {
        obsArray.push(new obs(w_canvas / 5.4 + 140 * i, h_canvas / 1.3 - 50 * i, 100, 30, "#af4112"));
    }
    obsArray.push(new checkpoint(600, 120, 15, 76, "grey"));

}

function Level1() {
    obsArray.push(new obs(100, 300, 30, 400));
    obsArray.push(new obs(100, 0, 30, 200));
    obsArray.push(new obs(200, 200, 50, 20));
    obsArray.push(new obs(300, 100, 50, 20));
    obsArray.push(new restarter(150, 400, 200, 20));
    obsArray.push(new restarter(350, 250, 100, 20));
    obsArray.push(new restarter(500, 250, 100, 20));
    obsArray.push(new checkpoint(600, 350, 15, 70, "grey"));
}