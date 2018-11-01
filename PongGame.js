//Pong Game on Javascript
//N0il
var w_height = 400, w_width = 700;
var name1 = "Computer", name2, velocity1 = 0, velocity2 = 0;
var points1 = 0, points2 = 0, arcColor = "#DCD8F3";
var pause = false, start = false, gameIsOn = false;
var mouse_x = 0, mouse_y = 0;
var playerAcelaration = 0.7, ballVelocityX = 7, ballVelocityY = 0;
var inbt3 = false, inbt2 = false, main = true;
var mouse_x2 = 0, mouse_y2 = 0;
var win1 = false, win2 = false;
var ballSlope = 0;
var prevX, prevY, b = 0;
var twoPlayers = false, dif = "normal";
var predy;

var image = "none";
var img = new Image();
var img1 = new Image();
img1.src = "https://www.freeiconspng.com/uploads/soccer-ball-clip-art-png-3.png";
var img2 = new Image(); 
img2.src = "https://storage.googleapis.com/proudcity/2016/05/Basketball-PNG.png";
var img3 = new Image();
img3.src = "https://vignette.wikia.nocookie.net/nintendo/images/3/3e/MTO_Tennis_Ball.png/revision/latest?cb=20120504075543&path-prefix=en";
var img4 =  new Image();
img4.src = "https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Summer-Vacation-PNG/Beach_Ball_PNG_Vector_Clipart.png?m=1507172108";
var img5 = new Image();  //easter eggs
img5.src = "rockstar.png";
var img7 = new Image();
img7.src = "https://img.ibxk.com.br/2014/11/24/24130515384285.jpg";
var img8 = new Image();
img8.src = "https://scontent.fopo3-1.fna.fbcdn.net/v/t1.0-9/18221616_1497365093632711_1671862169929430854_n.jpg?_nc_cat=108&_nc_ht=scontent.fopo3-1.fna&oh=d2422346cc1b9c6de9e43c5b4d26043e&oe=5C430DC6";
var img9 = new Image();
img9.src = "https://www.gannett-cdn.com/presto/2018/08/06/USAT/d7e9198a-b2fa-4ca6-b947-31c3751cc248-GettyImages-898660948.jpg?crop=5369,3020,x0,y0&width=3200&height=1680&fit=bounds";  //end of easter eggs
                        
var hitAudio = new Audio("hit.mp3");
var pointAudio = new Audio("point.mp3");
var winAudio = new Audio("win.mp3");
var gameAudio = new Audio("Bank.mp3");
gameAudio.volume = 0.6;

ctx = document.querySelector("canvas").getContext("2d");
ctx.canvas.height = 500;
ctx.canvas.width = w_width;

class Player {
  constructor(name, height, width, x, y, color) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color;
    this.Mx = this.x + this.width / 2;
    this.My = this.y + this.height / 2;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collision() {
	 //Collision against wall limits
    if (this.y < 10) {
      this.y = 10;
    }
    if (this.y + this.height > w_height - 4) {
      this.y = w_height - this.height - 5;
    }
  }
}
	
class Button {
  constructor(name, height, width, x, y, color) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color;
	this.disable = false;
  }

  clicked() {
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
	if(!this.disable){
		var clicked = true;
    	if (bottom < mouse_y || top > mouse_y || right < mouse_x || left > mouse_x) {
      		clicked = false;
    	}
    	return clicked;
	}
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText(this.name, this.x + 30, this.y + 35);
  }
}

var player1 = new Player(name2, 40, 20, w_width - 40, w_height / 2 - 15, "#FF2F2F");
var player2 = new Player(name1, 40, 20, 20, w_height / 2 - 15, "#2701D5");
var button1 = new Button("Start", 50, 160, w_width / 2 + 30, 300, "#2AD534");
var button2 = new Button("Controls", 50, 160, w_width / 4, 300, "#2AD534");
var button3 = new Button("Settings", 50, 160, w_width / 2 - 70, 370, "#808080");
var button4 = new Button("Go back", 50, 170, w_width - 230, w_height, "#000000");
var button5 = new Button("Easy", 50, 120, 50, 290, "#FDA233");
var button6 = new Button("Normal", 50, 150, 180, 290, "#FD2233");
var button7 = new Button("Hard", 50, 120, 340, 290, "#6D2233");
var button8 = new Button("Menu", 50, 130, w_width / 2 - 140, w_height - 150, "#FFA500");
var button9 = new Button("Repeat", 50, 150, w_width / 2, w_height - 150, "#FFA500");
var button10 = new Button("1 player", 50, 170, w_width / 4 - 5, 240, "#610083");
var button11 = new Button("2 players", 50, 170, w_width / 2 + 25, 240, "#ca054d");
var button12 = new Button("", 60, 60, 50, 430, "rgba(123,225,225,0.1)");
var button13 = new Button("", 60, 60, 120, 430, "rgba(123,225,225,0.1)");
var button14 = new Button("", 60, 60, 190, 430, "rgba(123,225,225,0.1)");
var button15 = new Button("", 60, 60, 260, 430, "rgba(123,225,225,0.1)");

ball = {
  x: w_width / 2,
  y: w_height / 2 + 10,  	
  radius: 15,
  ball_y_velocity: ballVelocityY,
  ball_x_velocity: ballVelocityX,
  ball_slope: 0,
  color: "#207830", 
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  },
  movement: function() {
    this.x += ballVelocityX;
    this.y += ballVelocityY;
  },
  
  collision: function(){
	  //Collision against wall limits
	 if(this.x + this.radius > w_width- 20 && (this.y < 120 || this.y > 280)){ //collision against right wall
		 console.log("rc");
		 ball.x = w_width - 20 - ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 hitAudio.play();
	 }
	  if(this.x - this.radius < 20 && (this.y < 120 || this.y > 280)){ //collision against left wall
		 console.log("lc");
		 ball.x = 0 + 20 + ball.radius;
		 ballVelocityX = -(ballVelocityX);
		  hitAudio.play();
	 }
	  if(this.y + this.radius > w_height - 2){ //collision against bottom wall
		  console.log("bc");
		  ball.y = w_height -2 - ball.radius;
		  ballVelocityY = -(ballVelocityY);
		  hitAudio.play();
	  }
	  if(this.y - this.radius < 6){ //collision against top wall
		  console.log("tc");
		  ball.y = 6 + ball.radius;
		  ballVelocityY = -(ballVelocityY);
		  hitAudio.play();
	  }
  },
};

controller = {
  up: false,
  down: false,
  up2: false,
  down2: false,
  space: false,
  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;
    switch (event.keyCode) {
      case 38:
        controller.up = key_state;
        break;
      case 40:
        controller.down = key_state;
        break;
      case 87:
        controller.up2 = key_state;
        break;
      case 83:
        controller.down2 = key_state;
        break;
      case 32:
        controller.space = key_state;
        break;
    }
  }
};

function playerBallCollision(){
	if(player2.x + player2.width > ball.x - ball.radius && ball.y + ball.radius > player2.y && ball.y - ball.radius < player2.y + player2.height - ((player2.height / 3) * 2) -10){
		 console.log("blueTop");
		 ball.x = player2.x + player2.width + ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = -3;
		hitAudio.play();
	}
	if(player2.x + player2.width > ball.x - ball.radius && ball.y + ball.radius > player2.y + (player2.height / 3) && ball.y - ball.radius < player2.y + player2.height- (player2.height / 3)){
		 console.log("blueMidle");
		 ball.x = player2.x + player2.width + ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = 0;
		hitAudio.play();
	}
	if(player2.x + player2.width > ball.x - ball.radius && ball.y + ball.radius > player2.y + ((player2.height / 3) * 2) && ball.y - ball.radius < player2.y + player2.height){
		 console.log("blueBottom");
		 ball.x = player2.x + player2.width + ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = 3;
		hitAudio.play();
	}
	if(player1.x < ball.x + ball.radius && ball.y + ball.radius > player1.y && ball.y - ball.radius < player1.y + player1.height - ((player1.height / 3) * 2) -10){
		 console.log("redTop");
		 ball.x = player1.x - ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = -3;
		hitAudio.play();
	}
	if(player1.x < ball.x + ball.radius && ball.y + ball.radius > player1.y + (player1.height / 3 )&& ball.y - ball.radius < player1.y + player1.height - (player1.height / 3)){
		 console.log("redMidle");
		 ball.x = player1.x - ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = 0;
		hitAudio.play();
	}
	if(player1.x < ball.x + ball.radius && ball.y + ball.radius > player1.y + ((player1.height / 3) * 2) && ball.y - ball.radius < player1.y + player1.height){
		 console.log("redBottom");
		 ball.x = player1.x - ball.radius;
		 ballVelocityX = -(ballVelocityX);
		 ballVelocityY = 3;
		hitAudio.play();
	}
}

function randomTrajectory(){
		if(Math.random() < 0.5){
			ballVelocityX = -(ballVelocityX);
		}
	var r = Math.random(); 
	if(r < 0.33){
		ballVelocityY = 1;
	}
	else if(r > 0.33 && r < 0.66){
		ballVelocityY = -1;
	}
	else if(r > 0.66){
		ballVelocityY = 0;
	}
}

function formData(){
	if(!twoPlayers){
		name1 = "Computer";
		name2 = document.getElementById("RedName").value;
	}
	if (twoPlayers){
		name1 = document.getElementById("BlueName").value;
		name2 = document.getElementById("RedName").value;
	}
}

function Init() {
  gameAudio.currentTime = 0;
  velocity1 = 0;
  velocity2 = 0;
  points1 = 0;
  points2 = 0;
  win1 = false;
  win2 = false;
  arcColor = "#DCD8F3";
  ball.x = w_width / 2;
  ball.y = w_height / 2 + 10;
  player1.x = w_width - 40;
  player1.y = w_height / 2 - 15;
  player2.x = 20;
  player2.y = w_height / 2 - 15;
  pause = false;
  randomTrajectory();
}

function AcelarationSet() {
  ctx.fillStyle = "#223534";
  ctx.font = "15px Arial";
  ctx.fillText("Players acelaration set to: " + playerAcelaration, 50, 360);
  ctx.fillText("Ball x velocity set to: " + ballVelocityX, 50, 380);
}

function imageSet(){
  ctx.fillStyle = "#223534";
  ctx.font = "15px Arial";
  ctx.fillText("You have chosen a " + image, 210, 415);
}

function Dificulty() {
  if (button5.clicked()) {
	dif = "easy";
    playerAcelaration = 0.5;
	ballVelocityX = 7;
    AcelarationSet();
  } else if (button6.clicked()) {
	  dif = "normal";
    playerAcelaration = 0.7;
	ballVelocityX = 9;
    AcelarationSet();
  } else if (button7.clicked()) {
	  dif = "hard";
    playerAcelaration = 1.1;
	ballVelocityX = 12;
    AcelarationSet();
  }
}

function changeImg(){
	if(button12.clicked()){
		img = img1;	
		image = "Football";
		imageSet();
	}
	if(button13.clicked()){
		img = img2;
		image = "Basketball";
		imageSet();
	}
	if(button14.clicked()){
		img = img3;
		image = "Tennis ball";
		imageSet();
	}
	if(button15.clicked()){
		img = img4;
		image = "Beach Ball";
		imageSet();
	}
}

function Movement() {
  if (controller.up) {
    velocity1 -= playerAcelaration;
  }
  if (controller.down) {
    velocity1 += playerAcelaration;
  }
  if (controller.up2 && (twoPlayers)) {
    velocity2 -= playerAcelaration;
  }
  if (controller.down2 && (twoPlayers)) {
    velocity2 += playerAcelaration;
  }
  if (controller.space) {
    pauseMenu();
  }

  player1.y += velocity1;
  player2.y += velocity2;
  velocity1 *= 0.9; //friction
  velocity2 *= 0.9; //friction
}

function AI(){
	var prevPredY;  //in order to execute only once: predy += 20;
	if(ball.x-ball.radius > 200){  //to look natural, cuz we tend to move to the midle when ball is away
	   if(player2.y > (w_height / 2) && player2.y != (w_height / 2 - 10)){
		   player2.y -= 2;
	   }
	   if(player2.y < (w_height / 2) && player2.y != (w_height / 2 - 10)){
		   player2.y += 2;
	   }
			predy = (ballSlope * (player2.x + player2.width)) + b; //predicted coords
		    prevPredY = predy;
	}

	if (dif == "easy"){
		if(Math.random() < 0.8 && prevPredY == predy){  //adding error factor to machine AI
			if(Math.random() < 0.5){  //randomizing the direction of machine error  80% error
			predy += 50;
			}
			else{
			predy -= 70;
			}
		}
	}
	if(dif == "normal"){
		if(Math.random() < 0.6 && prevPredY == predy){  //60% error
			if(Math.random() < 0.5){
			predy += 40;
			}
			else{
			predy -= 60;
			}
		}
	}
	if(dif == "hard"){	
		if(Math.random() < 0.4 && prevPredY == predy){  //40% error
			if(Math.random() < 0.5){
			predy += 40;
			}
			else{
			predy -= 60;
			}
		}
	}
	
	if(ball.x - ball.radius < 200){   
		console.log("predy: " + predy);
		if(player2.y < predy){
		   player2.y += 3;
		}
		else if(player2.y > predy){
			player2.y -= 3;
		}
	}
}

function drawScenario() {
	 ctx.clearRect(0, 0, w_width, 500);  //easter eggs
	if(name2 == "Noil" || name1 == "Noil"){
		ctx.drawImage(img5, 0, 0, w_width, w_height);
	}
	else if(name2 == "Ice" || name1 == "Ice"){
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, w_width, w_height);
	}
	else if(name2 == "Dark" || name1 == "Dark" ){
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, w_width, w_height);
	}
	else if(name2 == "Tiago" || name1 == "Tiago"){
		ctx.drawImage(img7, 0, 0, w_width, w_height);
	}
	else if(name2 == "Nuno" || name1 == "Nuno"){
		ctx.drawImage(img8, 0, 0, w_width, w_height);
	}
	else if(name2 == "Henrique" || name1 == "Henrique"){
		ctx.drawImage(img9, 0, 0, w_width, w_height);  //end of easter egg
	}
	else{  
		ctx.fillStyle = "#474B52";
        ctx.fillRect(0, 0, w_width, w_height);
	}
  ctx.strokeStyle = "#DCD8F3";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(w_width / 2, 0);
  ctx.lineTo(w_width / 2, w_height);
  ctx.stroke();
  ctx.strokeStyle = arcColor;
  ctx.beginPath();
  ctx.arc(w_width / 2, w_height / 2, 75, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = "#DCD8F3";
  ctx.arc(w_width / 2, w_height / 2, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#800080";
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 120);
  ctx.stroke();
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(0, 280);
  ctx.lineTo(0, 400);
  ctx.stroke();
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(w_width, 0);
  ctx.lineTo(w_width, 120);
  ctx.stroke();
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(w_width, 280);
  ctx.lineTo(w_width, 400);
  ctx.stroke();
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w_width, 0);
  ctx.stroke();
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, w_height);
  ctx.lineTo(w_width, w_height);
  ctx.stroke();
}

function pauseMenu() {
  gameAudio.pause();
  pause = true;
  ctx.fillStyle = "rgba(123,225,225,0.5)";
  ctx.fillRect(0, 0, w_width, 500);
  ctx.fillStyle = "#223534";
  ctx.font = "40px Arial";
  ctx.fillText("Paused", w_width / 2 - 40, 200);
  ctx.font = "20px Arial";
  ctx.fillText("Press any of the movement keys", 60, 300);
  ctx.fillText("(-w- / -s- / -arrow up- / -arrow down-) to continous", 60, 330);
  button4.draw();
  if (controller.up || controller.down || controller.up2 || controller.down2) {
	gameAudio.play();
    pause = false;
    ctx.clearRect(0, 0, w_width, 500);
  }
  if (button4.clicked()) {	
    gameAudio.pause();
    Init();
    gameIsOn = false;
    start = false;
  }
}

function Points() {
  if (ball.x < 0 && ball.y > 120 && ball.y < 280) {
    points2++;
	ball.x = w_width / 2;
	ball.Y = w_height / 2;
    arcColor = "#FF2F2F";
	randomTrajectory();
	pointAudio.play();
  }
  if (ball.x > w_width && ball.y > 120 && ball.y < 280) {
    points1++;
    ball.x = w_width / 2;
	ball.Y = w_height / 2; 
    arcColor = "#2701D5";
	randomTrajectory();
	  pointAudio.play();
  }
  if (points1 == 10) {
	  win1 = true;
	  pause = true;
	  gameAudio.pause();
	  winAudio.play();
  }
  if (points2 == 10) {
	  win2 = true;
	  pause = true;
	  gameAudio.pause();
	  winAudio.play();
  }
  ctx.fillStyle = "#2701D5";
  ctx.font = "25px Arial";
  ctx.fillText(name1 + ":  " + points1, w_width / 4 - 40, 450);
  ctx.fillStyle = "#FF2F2F";
  ctx.fillText(name2 + ":  " + points2, w_width - w_width / 4 - 100, 450);
}

function winPanel(){
	if(win1){	
		ctx.clearRect(0, 0, w_width, 500);
		ctx.fillStyle = "#57F1D5";
  		ctx.fillRect(0, 0, w_width, 500);
		ctx.fillStyle = "#2701D5";
    	ctx.font = "70px Arial";
    	ctx.fillText(name1 + " WINS", w_width / 2 - 230, 200);
	}
	else if(win2){
		ctx.clearRect(0, 0, w_width, 500);
		ctx.fillStyle = "#F1F22D";
  		ctx.fillRect(0, 0, w_width, 500);
		ctx.fillStyle = "#FF2F2F";
		ctx.font = "70px Arial";
    	ctx.fillText(name2 + " WINS", w_width / 2 - 230, 200);
	}
	
  	ctx.fillStyle = "#2701D5";
  	ctx.font = "25px Arial";
  	ctx.fillText(name1 + ":  " + points1, w_width / 4 - 40, 450);
  	ctx.fillStyle = "#FF2F2F";
  	ctx.fillText(name2 + ":  " + points2, w_width - w_width / 4 - 100, 450);
	
	if(win1 || win2){
			button8.draw();
			button9.draw();
			console.log(button9.clicked());
		if (button8.clicked()){
    		Init();
    		gameIsOn = false;
    		start = false;
		}
		if (button9.clicked()){
			Init();
			gameIsOn = true;
		}
	}

}

function mainMenu() {
  ctx.fillStyle = "rgba(123,225,225,0.5)";
  ctx.fillRect(0, 0, w_width, 500);
  ctx.fillStyle = "#223534";
  ctx.font = "40px Stencil";
  ctx.fillText("Menu", w_width / 2 - 40, 200);
  if (main) {
    button1.draw();
    button2.draw();
    button3.draw();
	button10.draw();
	button11.draw();
	  if(button10.clicked()){
		  twoPlayers = false;
	  }
	  if(button11.clicked()){
		  twoPlayers = true;
	  }
    if (button1.clicked()) {
	  Init();
	  if(name2 == "Tiago" || name1 == "Tiago"){  //easter egg
		 gameAudio.src = "9Dminor.mp3";
		 gameAudio.currentTime = 120;
		 gameAudio.play();
		  ctx.clearRect(0, 0, w_width, 500);
          start = true;
          gameIsOn = true;

      } 
	  if(name2 == "Noil" || name1 == "Noil"){  
		 gameAudio.src = "rockstar.mp3";
		 gameAudio.currentTime = 0;
		 gameAudio.play();
		  ctx.clearRect(0, 0, w_width, 500);
          start = true;
          gameIsOn = true;

      }  //end of easter egg
	  if(name2 != "Tiago" && name2 != "Noil" && name2 != undefined){
	  gameAudio.src = "Bank.mp3";
	  gameAudio.play();
	  ctx.clearRect(0, 0, w_width, 500);
      start = true;
      gameIsOn = true;
	  }
	  else{
		    ctx.fillStyle = "#FF2F2F";
            ctx.font = "30px Impact";
            ctx.fillText("Enter at least the red player name!!", 150, 100);
	  }
    } else if (button2.clicked()) {
      main = false;
      inbt2 = true;
    } else if (button3.clicked()) {
      main = false;
      inbt3 = true;
    }
  } else if (inbt2) {
    ctx.clearRect(0, 0, w_width, 500);
    ctx.fillStyle = "rgba(123,225,225,0.5)";
    ctx.fillRect(0, 0, w_width, 500);
    ctx.fillStyle = "#223534";
    ctx.font = "40px Stencil";
    ctx.fillText("Controls", w_width / 2 - 100, 200);
    ctx.font = "20px Arial";
    ctx.fillText("Press -Arrow up- or -Arrow down- to move the red player up or down", 20, 270);
    ctx.fillText("Press -W- or -S- to move the blue player up or down", 20, 300);
    ctx.fillText("Press -Space- to pause game and press any of the above keys to continous", 20, 330);
    button4.draw();
    if (button4.clicked()) {
      inbt2 = false;
      main = true;
      mainMenu();
    }
  } else if (inbt3) {
    ctx.clearRect(0, 0, w_width, 500);
    ctx.fillStyle = "rgba(123,225,225,0.5)";
    ctx.fillRect(0, 0, w_width, 500);
    ctx.fillStyle = "#223534";
    ctx.font = "40px Stencil";
    ctx.fillText("Settings", w_width / 2 - 100, 200);
    ctx.font = "20px Arial";
    ctx.fillText("Change dificulty: ", 50, 270);
    button5.draw();
    button6.draw();
    button7.draw();
    button4.draw();
    Dificulty();
	ctx.fillStyle = "#223534";
	ctx.font = "20px Arial";
    ctx.fillText("Choose the ball: ", 50, 415);
	  button12.draw();
	  ctx.drawImage(img1, button12.x, button12.y, button12.width, button12.height);
	  button13.draw();
	  ctx.drawImage(img2, button13.x, button13.y, button13.width, button13.height);
	  button14.draw();
	  ctx.drawImage(img3, button14.x, button14.y, button14.width, button14.height);
	  button15.draw();
	  ctx.drawImage(img4, button15.x, button15.y, button15.width, button15.height);
	  changeImg();
    if (button4.clicked()) {
      inbt3 = false;
      main = true;
      mainMenu();
    }
  }
}

function ballTrajectory(){
	prevX = ball.x - ballVelocityX;
	prevY = ball.y - ballVelocityY;
	
	ballSlope = (prevY - ball.y) / (prevX - ball.x);
	
	b = ball.y - (ball.x * ballSlope);
	ball.y = (ballSlope * ball.x) + b;
	
	console.log("y" + " = " + ballSlope + "x" + " + " + b);
}

function getCoords(e) {
  var canv = document.getElementById("myCanvas");
  var rect = canv.getBoundingClientRect();
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
}

loop = function() {
  if (gameIsOn == false) {
    mainMenu();
  }
  if (start == true) {
    if (!pause && !win1 && !win2) {
      drawScenario();
      Movement();
      player1.draw();
      player2.draw();
      player1.collision();
      player2.collision();
	  playerBallCollision();
      ball.movement();
      ball.draw();
	  ctx.drawImage(img,(ball.x - ball.radius),(ball.y - ball.radius),(ball.radius * 2),(ball.radius * 2));
	  ball.collision();
	  ballTrajectory();
	  Points();	
	  if(!twoPlayers){
		  AI();
	  }
    } else if (pause && !win1 && !win2) {
      pauseMenu();
    }
	  else if(win1 || win2){
		  winPanel();
	  }
  }
  window.requestAnimationFrame(loop);
};

window.addEventListener("click", getCoords);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

window.requestAnimationFrame(loop);