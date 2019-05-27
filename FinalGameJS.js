var myGamePiece;
var myObstacles = [];
var myScore;
var userHighScore = 0;
var displayHS;

function startGame() {
  console.log("started");
  var game = document.createElement("div");
  myGamePiece = new component(20, 30, "Character1M.png", 10, 150, "image");
  myScore = new component("30px", "Consolas", "black", 28, 40, "text");
  displayHS = document.createElement("p");
  displayHS.id = "HighScore";
  document.body.appendChild(displayHS)
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore;
  myGameArea.start();
}

var myGameArea = {
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
        ctx = myGameArea.context;
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
    this.newPos = function() {
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      this.hitSide();
    }
    this.hitSide = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        var top = 0;
        if (this.y > rockbottom) {
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
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i]) || this.y > (myGameArea.canvas.height - this.height) || this.y < 0) {
          stop();
          restartGame();
          return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 100;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    if (myGameArea.frameNo == 10000000){
      alert("yay");
    }
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function accelerate(n) {
  myGamePiece.gravity = n;
}
function moveGamePiece(event) {
  var keyPressed = event.keyCode;
 if (keyPressed == "32") {
   myGamePiece.speedY = -3;
      accelerate(-0.3);
   myGamePiece.image.src = "Character1MFlying.png"
 }
}
function resetMovement(){
  myGamePiece.image.src = "Character1M.png"
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  accelerate(0.2);
}

function restartGame() {
  if (myGameArea.frameNo > userHighScore) {
    userHighScore = myGameArea.frameNo;
    document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore;
  }
  myObstacles = [];
  myGameArea.frameNo = 0;
  myGamePiece = new component(20, 30, "Character1M.png", 10, 150, "image");
}
