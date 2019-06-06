var userCharacter;
var generatedObstaclesTop = [];
var generatedObstaclesBottom = [];
var userScore;
var userHighScore = 0;
var displayHighScore;
var BackgroundMusicJetpack;
var deathNoise;
var jetpackNoise;
var userLevel = 1;

function startJetpackGame() {
  BackgroundMusicJetpack = new sound("BackgroundMusicJetpack.mp3");
  deathNoise = new sound("DeathNoise.mp3");
  jetpackNoise = new sound("JetpackNoise.mp3");
  userCharacter = new component(20, 30, "Character1M.png", 10, 150, "image");
  userScore = new component("30px", "Consolas", "black", 28, 40, "text");
  displayHighScore = document.createElement("p");
  displayHighScore.id = "HighScore";
  document.body.appendChild(displayHighScore);
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  gameArea.start();
  document.getElementById("start").disabled = true;
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
       this.image = new Image();
       this.image.src = color;
   }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() {
        context = gameArea.context;
        if (this.type == "text") {
            context.font = this.width + " " + this.height;
            context.fillStyle = color;
            context.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            context.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
          }
          else {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPosition = function() {
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      this.hitTopOrBottom();
    }
    this.hitTopOrBottom = function() {
        var bottom = gameArea.canvas.height - this.height;
        var top = 0;
        if (this.y > bottom) {
            restartGame();
          }
          else if (this.y < top ) {
            restartGame();
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < generatedObstaclesTop.length; i += 1) {
        if (userCharacter.crashWith(generatedObstaclesTop[i]) || userCharacter.crashWith(generatedObstaclesBottom[i]) || this.y > (gameArea.canvas.height - this.height) || this.y < 0) {
          stop();
          restartGame();
          return;
        }
    }
    for (i = 0; i < generatedObstaclesBottom.length; i += 1) {
        if (userCharacter.crashWith(generatedObstaclesTop[i]) || userCharacter.crashWith(generatedObstaclesBottom[i]) || this.y > (gameArea.canvas.height - this.height) || this.y < 0) {
          stop();
          restartGame();
          return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyinterval(75)) {
      var building;
      var floornumber = Math.round(Math.random()*3);
      if(floornumber == 1){
        building = "Building1.png";
      }
      else if(floornumber == 2){
        building = "Building2.png";
      }
      else{
        building = "Building2.png";
      }
      var air;
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        if (height < 75){
          air = "Plane.png";
        }
        else if(height < 125){
          air = "Blimp.png";
        }
        else {
          air = "Helicopter.png";
        }

        minGap = 75;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        generatedObstaclesTop.push(new component(100, height, air, x, 0, "image"));
        generatedObstaclesBottom.push(new component(100, x - height - gap, building, x, height + gap, "image"));
    }
    if (userLevel == 1){
      levelOne();
    }
    else if (userLevel == 2) {
      levelTwo();
    }
    userScore.text="SCORE: " + gameArea.frameNo;
    if (gameArea.frameNo > userHighScore){
      userHighScore = gameArea.frameNo;
      document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;;
    }
    userScore.update();
    userCharacter.newPosition();
    userCharacter.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function accelerate(n) {
  userCharacter.gravity = n;
}
function moveGamePiece(event) {
    BackgroundMusicJetpack.play();
    jetpackNoise.play();
  var keyPressed = event.keyCode;
 if (keyPressed == "32") {
   userCharacter.speedY = -3;
      accelerate(-0.4);
   userCharacter.image.src = "Character1MFlying.png"
 }
 else if (keyPressed == "8") {
   alert("You gave up on level " + userLevel);
   userLevel++;
   gameArea.frameNo = 0;
   userHighScore = 0;
   updateGameArea();
   restartGame();
 }
 else {
   userCharacter.speedY = 3;
    accelerate(0.4);
 }
}
function resetMovement(){
  jetpackNoise.stop();
  userCharacter.image.src = "Character1M.png"
  userCharacter.speedX = 0;
  userCharacter.speedY = 0;
  accelerate(0.2);
}

function restartGame() {
  deathNoise.play();
  if (gameArea.frameNo > userHighScore) {
    userHighScore = gameArea.frameNo;
  }
  generatedObstaclesTop = [];
  generatedObstaclesBottom = [];
  gameArea.frameNo = 0;
  userCharacter = new component(20, 30, "Character1M.png", 10, 150, "image");
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}
function levelOne(){
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100){
        generatedObstaclesTop[i].x += -3;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if (gameArea.frameNo > 100){
        generatedObstaclesBottom[i].x += -3;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 100) {
    userLevel = 2;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    restartGame();
  }
}
function levelTwo(){
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100){
        generatedObstaclesTop[i].x += -3;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if (gameArea.frameNo > 100){
        generatedObstaclesBottom[i].x += -3;
        generatedObstaclesBottom[i].update();
      }
  }
}
