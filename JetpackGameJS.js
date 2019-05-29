var userCharacter;
var generatedObstacles = [];
var userScore;
var userHighScore = 0;
var displayHighScore;
var myMusic;

function startGame() {
  myMusic = new sound("BackgroundMusic.mp3");
  myMusic.play();
  var game = document.createElement("div");
  userCharacter = new component(20, 30, "Character1M.png", 10, 150, "image");
  userScore = new component("30px", "Consolas", "black", 28, 40, "text");
  displayHighScore = document.createElement("p");
  displayHighScore.id = "HighScore";
  document.body.appendChild(displayHighScore);
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore;
  gameArea.start();
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
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
          }
          else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
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
    for (i = 0; i < generatedObstacles.length; i += 1) {
        if (userCharacter.crashWith(generatedObstacles[i]) || this.y > (gameArea.canvas.height - this.height) || this.y < 0) {
          stop();
          restartGame();
          return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyinterval(75)) {
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 75;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        generatedObstacles.push(new component(10, height, "gold", x, 0));
        generatedObstacles.push(new component(10, x - height - gap, "goldenrod", x, height + gap));
    }
    for (i = 0; i < generatedObstacles.length; i += 1) {
        generatedObstacles[i].x += -3;
        generatedObstacles[i].update();
    }
    userScore.text="SCORE: " + gameArea.frameNo;
    if (gameArea.frameNo > userHighScore){
      userHighScore = gameArea.frameNo;
      document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore;
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
  var keyPressed = event.keyCode;
 if (keyPressed == "32") {
   userCharacter.speedY = -3;
      accelerate(-0.3);
   userCharacter.image.src = "Character1MFlying.png"
 }
}
function resetMovement(){
  userCharacter.image.src = "Character1M.png"
  userCharacter.speedX = 0;
  userCharacter.speedY = 0;
  accelerate(0.2);
}

function restartGame() {
  if (gameArea.frameNo > userHighScore) {
    userHighScore = gameArea.frameNo;
  }
  generatedObstacles = [];
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
