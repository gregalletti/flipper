var ball = new Ball(new Vec(0.7 , 8.5 ), true, 0);
var bonusBall = new Ball(new Vec(4.6, 2), false, 0);

var rightFlipper = new Flipper(new Vec(4.6, 6.7), 0, 210);
var leftFlipper = new Flipper(new Vec(3.7, 6.7), 1, -30);

var rightSlingshot = new Slingshot(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5));
var leftSlingshot = new Slingshot(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5));

var rightCoin = new Coin(new Vec(3.6, 4,2));
var leftCoin = new Coin(new Vec(1.2, 4.2));

var rightBumper = new Bumper(new Vec(2.2 - 1.1819, 6.7 + 0.020626));  
var middleBumper = new Bumper(new Vec(2.2 + 1.5055, 6.7 + 0.020626));  
var leftBumper = new Bumper(new Vec(2.2 + 0.11626, 6.7 -1.020626 ));  

var cube = new Cube(new Vec(0.7, 9.8), new Vec(1.7, 9.8), new Vec(1.7, 8.8), new Vec(0.7, 8.8));

//var cube = new Cube(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5), new Vec(4.1, 9.5));

var pipe = new Pipe(new Vec(2.2 + 0.3 , 6.7 -3.50626 ));

//for some sort of dark magic the left side is not 0, but something less 
var wall1 = new Wall(new Vec(-0.1, 1.22), new Vec(1.4, 1.22), 1);   //bottom-left little wall 
var wall2 = new Wall(new Vec(-0.1, 0), new Vec(0, BOARD_HEIGHT), 2);  //left board wall
var wall3 = new Wall(new Vec(-0.1, BOARD_HEIGHT), new Vec(BOARD_WIDTH, BOARD_HEIGHT), 3);   //top board wall
var wall4 = new Wall(new Vec(BOARD_WIDTH, BOARD_HEIGHT), new Vec(BOARD_WIDTH, 0), 4);   //right board wall
var wall5 = new Wall(new Vec(3.6, 1.22), new Vec(5, 1.22), 5);   //bottom-right little wall

wallsList = [wall1, wall2, wall3, wall4, wall5];

var score = 0;
var lives = 3;
var balls = 1;
var pulling = false;
var power = 0;

function isBetweenX(w, x, y) {
    if((x >= w.start.x && x <= w.end.x) || (x <= w.start.x && x >= w.end.x))
        return true;
    
    
    return false;
}
function isBetweenY(w, x, y) {
    if((y >= w.start.y && y <= w.end.y) || (y <= w.start.y && y >= w.end.y))

        return true;
    
    return false;
}


function controller() {
    for (let i = 0; i < SUBSTEPS; i++) {

        //handle ball launch
        if(pulling)
            power += 0.05;

        //handle flippers movement
        if(rightFlipper.moving){
            rightFlipper.angle = Math.max(rightFlipper.angle - 1, 150);
            play(flipperSound);
        }
        else{
            rightFlipper.angle = Math.min(rightFlipper.angle + 1, 210);
            //play(flipperDown);
        }
        if(leftFlipper.moving){
            leftFlipper.angle = Math.min(leftFlipper.angle + 1, 30);
            play(flipperSound);
        }
        else{
            leftFlipper.angle = Math.max(leftFlipper.angle - 1, -30);
            //play(flipperDown);
        }

        //rotate the coins on the board
        rightCoin.rotate();
        leftCoin.rotate();

        //if the ball has been launched
        if(!ball.ready) {

            //handle ball movement
            ball.move();          
            
            //check for all collisions (handled in model)  
/*
            ball.checkFlipperCollision(rightFlipper);
            ball.checkFlipperCollision(leftFlipper);

            ball.checkSlingshotCollision(rightSlingshot);
            ball.checkSlingshotCollision(leftSlingshot);
*/
            if(!rightCoin.taken)
                ball.checkCoinCollision(rightCoin);
            
            if(!leftCoin.taken)
                ball.checkCoinCollision(leftCoin);            

            ball.checkBumperCollision(rightBumper);
            ball.checkBumperCollision(middleBumper);
            ball.checkBumperCollision(leftBumper);

            ball.checkCubeCollision(cube);

            ball.checkPipeCollision(pipe);

            for (let wall of wallsList)
                ball.checkWallCollision(wall);

            //if there is the bonus ball
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
           // playSound(soundFlipperUp);
    }
    if (event.key === "n") {
        rightFlipper.moving = true;
           // playSound(soundFlipperUp);
    }
    if (event.key === " ") {
        pulling = true;
        //startSound.play();
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

