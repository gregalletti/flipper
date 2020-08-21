var ball = new Ball(new Vec(4.6, 2), true, 0);
var bonusBall = new Ball(new Vec(4.6, 2), false, 0);

var rightFlipper = new Flipper(new Vec(4.6, 6.7), 0, 210);  
var leftFlipper = new Flipper(new Vec(3.7, 6.7), 1, -30);  

var rightSlingshot = new Slingshot(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5));
var leftSlingshot = new Slingshot(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5));

var rightCoin = new Coin(new Vec(4.1, 10.5));
var leftCoin = new Coin(new Vec(4.1, 10.5));

var rightBumper = new Bumper(new Vec(4.6, 6.7));  
var middleBumper = new Bumper(new Vec(2.3, 6.7));  
var leftBumper = new Bumper(new Vec(3.7, 6.7));  

var cube = new Cube(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5), new Vec(4.1, 9.5));

var pipe = new Pipe(new Vec(4.6, 2.2));

var wall1 = new Wall(new Vec(4.1, 10.5), new Vec(5.1, 10.5));   //bottom-left little wall
var wall2 = new Wall(new Vec(4.1, 10.5), new Vec(5.1, 10.5));   //left board wall
var wall3 = new Wall(new Vec(4.1, 10.5), new Vec(5.1, 10.5));   //top board wall
var wall4 = new Wall(new Vec(4.1, 10.5), new Vec(5.1, 10.5));   //right board wall
var wall5 = new Wall(new Vec(4.1, 10.5), new Vec(5.1, 10.5));   //bottom-right little wall

wallsList = [wall1, wall2, wall3, wall4, wall5];

var score = 0;
var lives = 3;
var balls = 1;
var pulling = false;
var power = 0;

function controller() {
    for (let i = 0; i < SUBSTEPS; i++) {

        if(pulling)
            power += 0.05;

        if(rightFlipper.moving)
            rightFlipper.angle = Math.max(rightFlipper.angle - 1, 150);
        else
            rightFlipper.angle = Math.min(rightFlipper.angle + 1, 210);

        if(leftFlipper.moving)
            leftFlipper.angle = Math.min(leftFlipper.angle + 1, 30);
        else
            leftFlipper.angle = Math.max(leftFlipper.angle - 1, -30);


        rightCoin.rotate();
        leftCoin.rotate();

        if(!ball.ready) {

            ball.move();            

            ball.checkFlipperCollision(rightFlipper);
            ball.checkFlipperCollision(leftFlipper);

            ball.checkSlingshotCollision(rightSlingshot);
            ball.checkSlingshotCollision(leftSlingshot);

            
            ball.checkCoinCollision(rightCoin);
            ball.checkCoinCollision(leftCoin);            

            ball.checkBumperCollision(rightBumper);
            ball.checkBumperCollision(middleBumper);
            ball.checkBumperCollision(leftBumper);

            ball.checkCubeCollision(cube);

            ball.checkPipeCollision(pipe);

            for (let wall of wallsList)
                ball.checkWallCollision(wall);

            if(balls > 1)
                ball.checkBallCollision(bonusBall);
        }
        
    }    
}


window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onKeyReleased);

function onKeyPressed(event) {
    if (event.key === "z") {
        leftFlipper.moving = true;
        if(leftFlipper.angleRatio < .8)
        console.log("ha")
           // playSound(soundFlipperUp);
    }
    if (event.key === "n") {
        rightFlipper.moving = true;
        if(rightFlipper.angleRatio < .8)
        console.log("ha")
           // playSound(soundFlipperUp);
    }
    if (event.key === " ") {
        pulling = true;
        console.log("I'm pulling the ball")
        //playSound(soundStart);
    }
}
function onKeyReleased(event) {
    if (event.key === "z") {
        leftFlipper.moving = false;
       // playSound(soundFlipperDown);
    }
    if (event.key === "n") {
        rightFlipper.moving = false;
      //  playSound(soundFlipperDown);
    }
    if (event.key === " ") {
        pulling = false;
        ball.launch();
        power = 0;
      //  playSound(soundPuller);
    }
}