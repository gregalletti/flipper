//HERE WE CREATE ALL THE NEEDED OBJECTS TO SET UP AND START THE GAME

var ball = new Ball(new Vec2(4.6, 2), true, 0);  //default ball
var ball2 = new Ball(new Vec2(2.3, 9.3), true, 1);   //bonus ball

var rightFlipper = new Flipper(new Vec2(3.6, 1.22), 0, 210);
var leftFlipper = new Flipper(new Vec2(1.4, 1.22), 1, -30);

var rightSlingshot = new Slingshot(new Vec2(3.35, 1.65), new Vec2(4.35, 2.65), new Vec2(4.35, 1.65), 0);
var leftSlingshot = new Slingshot(new Vec2(1.5, 1.65), new Vec2(0.5, 2.65), new Vec2(0.5, 1.65), 1);

var rightCoin = new Coin(new Vec2(3.6, 4,2));
var leftCoin = new Coin(new Vec2(1.2, 4.2));

var rightBumper = new Bumper(new Vec2(2.2 - 1.1819, 6.7 + 0.020626), 1);  
var middleBumper = new Bumper(new Vec2(2.2 + 1.5055, 6.7 + 0.020626), 2);  
var leftBumper = new Bumper(new Vec2(2.2 + 0.11626, 6.7 -1.020626), 3);  

var cube = new Cube(new Vec2(0.7, 9.8), new Vec2(1.7, 9.8), new Vec2(1.7, 8.8), new Vec2(0.7, 8.8));

var pipe = new Pipe(new Vec2(2.2 + 0.3 , 6.7 -3.50626 ));

//for some sort of dark magic the left side is not 0, but something less 
var wall1 = new Wall(new Vec2(- 0.2, 1.22), new Vec2(1.4, 1.22), 1);   //bottom-left little wall 
var wall2 = new Wall(new Vec2(- 0.2, 0), new Vec2(0, BOARD_HEIGHT), 2);  //left board wall
var wall3 = new Wall(new Vec2(- 0.2, BOARD_HEIGHT - 0.2), new Vec2(BOARD_WIDTH, BOARD_HEIGHT - 0.2), 3);   //top board wall
var wall4 = new Wall(new Vec2(BOARD_WIDTH, BOARD_HEIGHT), new Vec2(BOARD_WIDTH, 0), 4);   //right board wall
var wall5 = new Wall(new Vec2(3.6, 1.22), new Vec2(5, 1.22), 5);   //bottom-right little wall

//let's make an array to better handle them
var wallsList = [wall1, wall2, wall3, wall4, wall5];

var ramp = new Ramp(new Vec2(RAMP_START_X, RAMP_START_Y), new Vec2(RAMP_START_X, BOARD_HEIGHT));   //left wall of the ramp


//functions needed for lines collision to check whether the impact point is between the line start and end points
function isBetweenX(p1, p2, x, y) {
    if((x >= p1.x && x <= p2.x) || (x <= p1.x && x >= p2.x))
        return true;    
    
    return false;
}

function isBetweenY(p1, p2, x, y) {
    if((y >= p1.y && y <= p2.y) || (y <= p1.y && y >= p2.y))
        return true;
    
    return false;
}

//function to start and manage the game
function startGame() {
    for (let i = 0; i < 5; i++) {

        //handle ball launch
        if(pulling)
            power += 0.05;

        if(rampMovingUp){
            rampY = Math.min(rampY + 0.004, 1);
            goombaScale = Math.max(goombaScale - 0.01, 0);

            if(rampY == 1){
                rampMovingUp = false;
                rampActive = true;
            }
        }
        if(rampMovingDown){
            rampY = Math.max(rampY - 0.004, 0);
            goombaScale = Math.min(goombaScale + 0.01, 3);
            if(rampY == 0){
                rampMovingDown = false;
                rampActive = false;
                mission.innerHTML = "";
            }
        }

        //handle flippers movement and set some values
        if(rightFlipper.moving){
            rightFlipper.angle = Math.max(rightFlipper.angle - 2, 150);
            if(rightFlipper.angle == 150)
                rightFlipper.stall = true;
            else
                rightFlipper.stall = false;
        }
        else{
            rightFlipper.angle = Math.min(rightFlipper.angle + 2, 210);
            if(rightFlipper.angle == 210)
                rightFlipper.stall = true;
            else
                rightFlipper.stall = false;
        }

        if(leftFlipper.moving){
            leftFlipper.angle = Math.min(leftFlipper.angle + 2, 30);
            if(leftFlipper.angle == 30)
                leftFlipper.stall = true;
            else
                leftFlipper.stall = false;
        }
        else{
            leftFlipper.angle = Math.max(leftFlipper.angle - 2, -30);
            if(leftFlipper.angle == -30)
                leftFlipper.stall = true;
            else
                leftFlipper.stall = false;
        }

        //rotate the coins on the board
        rightCoin.rotate();
        leftCoin.rotate();

        //move up and down the cube 
        cubeZ += 0.01;
        
        //if the ball has been launched
        if(ball.active) {

            //handle ball movement
            ball.move();
            
            //check for all collisions (handled in model)  
            ball.checkFlipperCollision(rightFlipper);
            ball.checkFlipperCollision(leftFlipper);

            ball.checkSlingshotCollision(rightSlingshot);
            ball.checkSlingshotCollision(leftSlingshot);

            if(!rightCoin.taken)
                ball.checkCoinCollision(rightCoin);
            
            if(!leftCoin.taken)
                ball.checkCoinCollision(leftCoin);            

            ball.checkBumperCollision(rightBumper);
            ball.checkBumperCollision(middleBumper);
            ball.checkBumperCollision(leftBumper);

            ball.checkCubeCollision(cube);

            ball.checkPipeCollision(pipe);

            if(rampActive)
                ball.checkRampCollision(ramp);

            for (let wall of wallsList)
                ball.checkWallCollision(wall);
                
        }
        //if there is the bonus ball
        if(ball2.active)   {

            //handle ball movement
            ball2.move();          
            
            //check for all collisions (handled in model)  
            ball2.checkFlipperCollision(rightFlipper);
            ball2.checkFlipperCollision(leftFlipper);

            ball2.checkSlingshotCollision(rightSlingshot);
            ball2.checkSlingshotCollision(leftSlingshot);
                
            if(!rightCoin.taken)
                ball2.checkCoinCollision(rightCoin);
            
            if(!leftCoin.taken)
                ball2.checkCoinCollision(leftCoin);            

            ball2.checkBumperCollision(rightBumper);
            ball2.checkBumperCollision(middleBumper);
            ball2.checkBumperCollision(leftBumper);

            ball2.checkCubeCollision(cube);

            ball2.checkPipeCollision(pipe);

            if(rampActive)
                ball2.checkRampCollision(ramp);

            for (let wall of wallsList)
                ball2.checkWallCollision(wall);

        //handle balls collision
        if(ball.active && ball2.active)
            ball.checkBallCollision(ball2);
        
        }
    }    
}

//add listeners on key bindings to move objects
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onKeyReleased);

function onKeyPressed(e) {
    if (e.key === "z") {
        //move left flipper up
        leftFlipper.moving = true;
        play(flipperUp);
    }
    if (e.key === "m") {
        //move right flipper up
        rightFlipper.moving = true;
        play(flipperUp);
    }
    if (e.key === " ") {
        //move puller backward
        if(ball.ready && ball2.ready){
            if(!pulling)
                play(pullerSound);
            pulling = true;
        }
    }
}

function onKeyReleased(e) {
    if (e.key === "z") {
        //move left flipper down
        leftFlipper.moving = false;
        play(flipperDown);
    }
    if (e.key === "m") {
        //move right flipper down
        rightFlipper.moving = false;
        play(flipperDown);
    }
    if (e.key === " ") {
        //move puller forward, then launch the ball and reset power
        stopAudio(pullerSound)
        pulling = false;
        ball.launch();
        power = 0;
    }
}