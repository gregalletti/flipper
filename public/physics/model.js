/*
BOARD (3 linee) 
 _
| |
 
BUMPER (3 + sfera -> cerchi)
BALL (cerchio)
SLINGSHOTS (triangoli)
FLIPPER (linee)
WALL (triangoli) meglio linee, ipotenusa
OBSTACLE (rettangoli)

WALL = BOARD
*/

/*
ALL THE MEASUREMENTS HAVE BEEN DONE THROUGH BLENDER
*/

class PointLight {
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }
}

//coords, velocity, acceleration...
class Vec {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //USEFUL METHODS

    getAbs() {
        return Math.hypot(this.x, this.y);
    }

    getPhase() {
        return Math.atan2(this.y, this.x);
    }

    add(vector) {
        return new Vec(this.x + vector.x, this.y + vector.y);
    }

   
    scale(factor) {
        return new Vec(factor * this.x, factor * this.y);
    }

    sub(vector) {
        return this.add(vector.scale(-1));
    }

    normalize() {
        
        return new Vec(Math.cos(this.getPhase()), Math.sin(this.getPhase()));
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    normal() {
        return new Vec(-this.y, this.x);
    }

    invertX() {
        return new Vec(- this.x, this.y);
    }

    invertY() {
        return new Vec(this.x, - this.y);
    }
}

//circle
class Ball {

    constructor(coords, ready, number) {

        this.coords = coords;
        this.ready = ready;
        this.number = number;
    }

    active = false;
    speed = new Vec(0, 0);

    launch() {
        if (!this.ready || ball2.active)
            return;
        this.speed = new Vec(0, Math.min(power, BALL_MAX_SPEED));
        
        play(ballRoll)
        ballRoll.volume = 0.05;
        this.ready = false;
        this.active = true;
        //ball2.active = true;
    }

    move() {
       
        //apply some gravity to the ball speed
        this.speed = this.speed.add(new Vec(0, - 0.015));

        if(this.coords.x > 4.5)
            this.speed = this.speed.add(new Vec(- 0.005, 0));

        if(this.coords.x < 0.5)
            this.speed = this.speed.add(new Vec(0.005, 0));

        //limit the ball speed to avoid crazy things
        if(this.speed.getAbs() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
        
        //increase the ball speed to avoid blocking
        if(this.speed.getAbs() < BALL_MIN_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MIN_SPEED);
        
        //apply velocity (for the time interval) to the ball coords
        this.coords = this.coords.add(this.speed.scale(T));

        //check if the ball falls out
        if(this.coords.y < 0.5) {            
            //if both balls were on the board then no problem
            if(ball.active && ball2.active) {
                //just remove the ball and go on
                this.speed = new Vec(0,0);
                if(this.number == 0) {
                    this.coords = new Vec(4.6, 2);
                    angleY1 = 0;
                    angleZ1 = 0;
                    showBall = false;
                }
                else {
                    this.coords = new Vec(2.3, 9.3);
                    angleY2 = 0;
                    angleZ2 = 0;
                }
                this.active = false;
                this.ready = true;
                
            }
            else {
                currentCubeTex = DEFAULT_CUBE_UVS;
                //if there was only one ball on the board
                if(lives > 1) {
                    stopAudio(ballRoll);
                    //play(fallenBallSound);
                    //prepare the next ball and update lives
                    lives--;
                    this.speed = new Vec(0,0);
                    if(this.number == 0)
                        this.coords = new Vec(4.6, 2);
                    else
                        this.coords = new Vec(2.3, 9.3);

                    showBall = true;
                    angleY1 = 0;
                    angleZ1 = 0;
                    angleY2 = 0;
                    angleZ2 = 0;
                    this.ready = true;
                    this.active = false;
                    play(gameoverSound);  

                }
                else if(lives == 1){
                    lives--;
                    stopAudio(ballRoll);
                    play(gameoverSound);
                    window.location.replace("gameover.html?score="+currentScore);

                }
                    
            }         
        }
        
        
    }

    checkWallCollision(wall) {

        // get dot product of the line and circle
        let dot = (((this.coords.x - wall.start.x)*(wall.end.x - wall.start.x)) + ((this.coords.y - wall.start.y)*(wall.end.y - wall.start.y)) ) / Math.pow(wall.length, 2);
    
        // find the closest point on the line
        let closestX = wall.start.x + (dot * (wall.end.x - wall.start.x));
        let closestY = wall.start.y + (dot * (wall.end.y - wall.start.y));
    
        // get distance to closest point
        let distX = closestX - this.coords.x;
        let distY = closestY - this.coords.y;
        let distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
                this.handleWallCollision(wall, closestX, closestY, distance);
        }
        return;
  
    }

    handleWallCollision(wall, closestX, closestY, distance) {
        let error = BALL_RADIUS - distance;
        
        

        if((wall.number == 1 || wall.number == 3 || wall.number == 5)){
            if(isBetweenX(wall.start, wall.end, closestX, closestY)){
                this.speed = this.speed.invertY().scale(WALL_BOOST);
               
                if((wall.number == 1 || wall.number == 5))
                    this.coords = this.coords.add(new Vec(0, error));
                else
                    this.coords = this.coords.add(new Vec(0, - error));
            }
        }
        else {
            if(isBetweenY(wall.start, wall.end, closestX, closestY)){
                this.speed = this.speed.invertX().scale(WALL_BOOST);
                
                if(wall.number == 2)
                    this.coords = this.coords.add(new Vec(error, 0));
                else
                    this.coords = this.coords.add(new Vec(- error, 0));  
            }
        } 

    }


    checkBumperCollision(bumper) {

        let distance = this.coords.sub(bumper.position);
        
        if (distance.getAbs() <= BALL_RADIUS + BUMPER_RADIUS) {
            play(bumperSound);
            this.handleBumperCollision(bumper, distance);
            this.makeLight(bumper.position, "#ff5700");
        }
        return;
    }

    handleBumperCollision(bumper, distance) {

        let impactPoint = (distance.normalize().scale(BUMPER_RADIUS)).add(bumper.position);

        //calculate normal and tangent vector 
        let N = this.coords.sub(impactPoint).normalize();
        let T = N.normal();

        let error = BALL_RADIUS + BUMPER_RADIUS - distance.getAbs();
        let offset = N.scale(BALL_RADIUS + error);
        this.coords = impactPoint.add(offset);


        //speed is composed by the 2 components
        let oldSpeed = this.speed.scale(BUMPER_BOOST);
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));
        
        //limit the ball speed to avoid crazy things
        if(this.speed.getAbs() > BALL_MAX_SPEED)
        this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);

        currentScore += BUMPER_SCORE;
     }


    checkPipeCollision(pipe) { 

        let distance = this.coords.sub(pipe.position);
        
        if (distance.getAbs() <= BALL_RADIUS + PIPE_RADIUS) {
            play(pipeSound);
            this.handlePipeCollision(pipe, distance);
            this.makeLight(pipe.position, "#47ff66");
        }
        return;
    }

    handlePipeCollision(pipe, distance) {

        let impactPoint = (distance.normalize().scale(PIPE_RADIUS)).add(pipe.position);

        //calculate normal and tangent vector 
        let N = this.coords.sub(impactPoint).normalize();
        let T = N.normal();

        let error = BALL_RADIUS + PIPE_RADIUS - distance.getAbs();
        let offset = N.scale(BALL_RADIUS + error);
        this.coords = impactPoint.add(offset);

        //speed is composed by the 2 components
        let oldSpeed = this.speed.scale(PIPE_BOOST);
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));


/*      
        OLD VERSION(TOO BAD)
        let a = (Math.pow(BALL_RADIUS, 2) - Math.pow(PIPE_RADIUS,2) + Math.pow(BALL_RADIUS + PIPE_RADIUS,2) ) / (2 * (BALL_RADIUS + PIPE_RADIUS))
        let h_squared = Math.pow(BALL_RADIUS, 2) - Math.pow(a, 2);

        let tempX = this.coords.x + a * ( pipe.position.x - this.coords.x ) / (BALL_RADIUS + PIPE_RADIUS);
        let tempY = this.coords.y + a * ( pipe.position.y - this.coords.y ) / (BALL_RADIUS + PIPE_RADIUS);

        let impactX = tempX + Math.sqrt(h_squared) * ( pipe.position.y - this.coords.y ) / (BALL_RADIUS + PIPE_RADIUS);
        let impactY = tempY + Math.sqrt(h_squared) * ( pipe.position.x - this.coords.x ) / (BALL_RADIUS + PIPE_RADIUS);

        let impactAngle = impactPoint.getPhase();
*/

     }


    checkCubeCollision(cube) { 
        //p1 is the TOP LEFT point of the square
        // temporary variables to set edges for testing
        let testX = this.coords.x;
        let testY = this.coords.y;

        let edge = 0;

        // which edge is closest?
        if (this.coords.x < cube.p1.x) { 
            edge = 0;       
            testX = cube.p1.x;      // test left edge
        }
        else if (this.coords.x > cube.p1.x + CUBE_EDGE) {
            edge = 2;       
            testX = cube.p1.x + CUBE_EDGE;   // right edge
        }

        if (this.coords.y > cube.p1.y) {    
            edge = 1;       
            testY = cube.p1.y;      // top edge
        }
        else if (this.coords.y < cube.p1.y - CUBE_EDGE) {
            edge = 3;       
            testY = cube.p1.y - CUBE_EDGE;   // bottom edge
        }

        // get distance from closest edges
        let distX = this.coords.x - testX;
        let distY = this.coords.y - testY;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );

        // if the distance is less than the radius, collision!
        if (distance <= BALL_RADIUS) {               
            this.handleCubeCollision(cube, edge, distance);
            this.makeLight(new Vec((cube.p1.x+cube.p2.x+cube.p3.x+cube.p4.x)/4,
                                   (cube.p1.y+cube.p2.y+cube.p3.y+cube.p4.y)/4), "#ffffff"); //p1 o p3 adesso vediamo
        }
        return;
    }

    handleCubeCollision(cube, edge, distance) { 

        let error = BALL_RADIUS - distance;

        if(edge == 0)   {
            this.coords = this.coords.add(new Vec(- error, 0));
            this.speed = this.speed.invertX();
        }
        else if (edge == 1)    {
            this.coords = this.coords.add(new Vec(0, error));  
            this.speed = this.speed.invertY();
        }
        else if (edge == 2)    {
            this.coords = this.coords.add(new Vec(error, 0)); 
            this.speed = this.speed.invertX();
        } 
        else if (edge == 3)    {
            this.coords = this.coords.add(new Vec(0, - error));  
            this.speed = this.speed.invertY();
        }

        currentScore += CUBE_SCORE;

        if(shouldChangeCubeTexture)    {
            //must change texture of the cube (handled in drawingobj)
            cubeOutcome = Math.round(Math.random()) + 1;    //random number between 1 and 2
            if(cubeOutcome == 1){
                play(heart);
                currentCubeTex = HEART_CUBE_UVS;
                if(lives < 3) {
                    
                    lives++;
                }
                else{
                    //play(magicCubeSound);
                    currentScore += 50;
                }
            }
            else{
                play(star);
                currentCubeTex = STAR_CUBE_UVS;
                if(ball2.active){
                    //play(magicCubeSound);
                    currentScore += 100;
                }
                else{
                    ball2.active = true;
                }
            }

            shouldChangeCubeTexture = false;
        }
        else
            play(magicCubeSound);

    }


    checkSlingshotCollision(slingshot) { 

        //semplicemente controllo collisione con 3 linee: una di queste è l'ipotenusa quindi deve bounceare
        //P1-P2
        let dot = (((this.coords.x - slingshot.p1.x)*(slingshot.p2.x - slingshot.p1.x)) + ((this.coords.y - slingshot.p1.y)*(slingshot.p2.y - slingshot.p1.y)) ) / Math.pow(slingshot.p12_length, 2);
    
        let closestX = slingshot.p1.x + (dot * (slingshot.p2.x - slingshot.p1.x));
        let closestY = slingshot.p1.y + (dot * (slingshot.p2.y - slingshot.p1.y));
    
        let distX = closestX - this.coords.x;
        let distY = closestY - this.coords.y;
        let distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
            if(slingshot.side == 0){
                if((closestX >= slingshot.p1.x && closestX <= slingshot.p2.x) && (closestY >= slingshot.p1.y && closestY <= slingshot.p2.y)){
                    play(slingshotSound);
                    if(this.coords.y >= slingshot.p1.y)
                        this.handleSlingshotCollision(slingshot, 0, distance); //bounce
                }
            }
            else {
                if((closestX >= slingshot.p2.x && closestX <= slingshot.p1.x) && (closestY >= slingshot.p1.y && closestY <= slingshot.p2.y)){
                    play(slingshotSound);
                    if(this.coords.y >= slingshot.p1.y)
                        this.handleSlingshotCollision(slingshot, 0, distance); //bounce
                }
            }
        }
        
        //P2-P3
        dot = (((this.coords.x - slingshot.p2.x)*(slingshot.p3.x - slingshot.p2.x)) + ((this.coords.y - slingshot.p2.y)*(slingshot.p3.y - slingshot.p2.y)) ) / Math.pow(slingshot.p23_length, 2);
    
        closestX = slingshot.p2.x + (dot * (slingshot.p3.x - slingshot.p2.x));
        closestY = slingshot.p2.y + (dot * (slingshot.p3.y - slingshot.p2.y));
    
        distX = closestX - this.coords.x;
        distY = closestY - this.coords.y;
        distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
                if((closestY <= slingshot.p2.y && closestY >= slingshot.p3.y))
                    this.handleSlingshotCollision(slingshot, 1, distance); //no bounce
        }
        
        //P1-P3
        dot = (((this.coords.x - slingshot.p1.x)*(slingshot.p3.x - slingshot.p1.x)) + ((this.coords.y - slingshot.p1.y)*(slingshot.p3.y - slingshot.p1.y)) ) / Math.pow(slingshot.p13_length, 2);
    
        closestX = slingshot.p1.x + (dot * (slingshot.p3.x - slingshot.p1.x));
        closestY = slingshot.p1.y + (dot * (slingshot.p3.y - slingshot.p1.y));
    
        distX = closestX - this.coords.x;
        distY = closestY - this.coords.y;
        distance = Math.sqrt((distX * distX) + (distY * distY));
        
        if (distance <= BALL_RADIUS) {
            if(slingshot.side == 0){
                
                if((closestX >= slingshot.p1.x && closestX <= slingshot.p3.x))
                    this.handleSlingshotCollision(slingshot, 2, distance); //no bounce
            }
            else {
                if((closestX <= slingshot.p1.x && closestX >= slingshot.p3.x))
                    this.handleSlingshotCollision(slingshot, 2, distance); //no bounce
            }
        }
        return;
    }


    handleSlingshotCollision(slingshot, num, distance) { 

        let error = BALL_RADIUS - distance;

        if(num == 0)    {

        //calculate normal and tangent vector 
        let N = slingshot.side == 0 ? new Vec(- Math.sqrt(2) / 2, Math.sqrt(2) / 2) : new Vec(Math.sqrt(2) / 2, Math.sqrt(2) / 2);
        let T = N.normal();

        //speed is composed by the 2 components
        let oldSpeed = this.speed.scale(SLINGSHOT_HYP_BOOST);
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));
            currentScore += SLINGSHOT_HYP_SCORE;

            let errorXY = error * Math.sqrt(2) / 2;
            this.coords = slingshot.side == 0 ? this.coords.add(new Vec(- errorXY, errorXY)) : this.coords.add(new Vec(errorXY, errorXY));
        
            this.makeLight(slingshot.p1, "#47ff66");
        }
        else if(num == 1)   {
            this.speed = (this.speed.invertX().scale(SLINGSHOT_BOOST));
            this.coords = slingshot.side == 0 ? this.coords.add(new Vec(error, 0)) : this.coords.add(new Vec(- error, 0));
        }
        else    {

            this.speed = (this.speed.invertY().scale(SLINGSHOT_BOOST));
            this.coords = this.coords.add(new Vec(0, - error));
        }

        //limit the ball speed to avoid crazy things
        if(this.speed.getAbs() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
    }


    checkBallCollision(ball) { 
        
        let distance = this.coords.sub(ball.coords);
        
        if (distance.getAbs() <= BALL_RADIUS * 2) {
            this.handleBallCollision(ball, distance);
        }
        return;
    }

    handleBallCollision(ball, distance) { 

        let error = BALL_RADIUS * 2 - distance.getAbs();
        let speed1 = this.speed;
        let speed2 = ball.speed;

        this.speed = speed2;
        ball.speed = speed1;

        this.coords = this.coords.add(this.speed.scale(error));
        ball.coords = ball.coords.add(ball.speed.scale(error))

        play(ballsCollisionSound);

    }

     
    checkFlipperCollision(flipper) { 

        let distance = this.coords.sub(flipper.position);
        let projectionX = distance.dot(flipper.getCurrentDirection());
        projectionX = Math.max(0, Math.min(projectionX, FLIPPER_LENGTH)); // clamp flipperAbscissa in [0, length]

        let impactPoint = flipper.getCurrentDirection().scale(projectionX).add(flipper.position);

        let realDistance = this.coords.sub(impactPoint);
        if (realDistance.getAbs() <= BALL_RADIUS){
            this.handleFlipperCollision(flipper, realDistance, impactPoint, projectionX);
        }
    }

    handleFlipperCollision(flipper, realDistance, impactPoint, projectionX) {

        let impactPointSpeed = flipper.getCurrentDirection().normal().scale(projectionX * flipper.getAngularSpeed()); //alan facchinetti way
        let N = realDistance.normalize();
        
        let error = BALL_RADIUS - realDistance.getAbs();
        let offset = N.scale(BALL_RADIUS + error);
        this.coords = impactPoint.add(offset);

        let newSpeed = this.speed.sub(impactPointSpeed);
        let T = N.normal(); 
        let vT = newSpeed.dot(T);
        let vN = newSpeed.dot(N);
        
        //flipper power was too low, multiplied by 200 LOL
        vN += impactPointSpeed.getAbs() * 200;
        newSpeed = N.scale(vN).add(T.scale(vT));

        this.speed = newSpeed.add(impactPointSpeed);

            //this.speed = new Vec(0,200);

/*      INSTABILE, COMMENTATA PER ORA
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));     

        //limit the ball speed to avoid crazy things
        if(this.speed.getAbs() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
            */
    }


     checkCoinCollision(coin) { 
        let distance = this.coords.sub(coin.position);
        
        if (distance.getAbs() <= BALL_RADIUS + COIN_RADIUS) {
            this.handleCoinCollision(coin, distance);
        }
        return;
    }

    handleCoinCollision(coin) { 
        coin.taken = true;

        currentScore += COIN_SCORE;
        play(coinSound);
        coin.scaleAndElevate();
    }

    makeLight(objPos,color){
        pLight = new PointLight(objPos, color); // colore a caso per provare
        setTimeout(()=>{
            pLight = new PointLight(new Vec(0,0),"#000000")
        }, 5000);
    }
}



//line
class Wall {
    constructor(start, end, number) {

        this.start = start;
        this.end = end;
        this.number = number;
        this.length = end.sub(start).getAbs();
        this.direction = end.sub(start).normalize();

    }

}

//circle
class Bumper {

    constructor(position) {

        this.position = position;

    }

}

//circle
class Coin {

    constructor(position) {

        this.position = position;

    }

    rotationAngle = 0;
    scale = 0.5;
    z = 9;
    taken = false;

    rotate() { 
        this.rotationAngle = this.rotationAngle + 0.02;
    }
      
    async scaleAndElevate() {

        //a quanto pare un FOR non va bene
        //gradually increase z of the coin and decrease scale (arcade feels on purpose with non-fluid transformations)
        setTimeout(() => {this.z = 9.1; this.taken = true;}, 150);
        setTimeout(() => {this.z = 9.2;}, 300);
        setTimeout(() => {this.z = 9.2;}, 450);
        setTimeout(() => {this.z = 9.3;}, 600);
        setTimeout(() => {this.scale = 0.4; this.z = 9.4;}, 750);
        setTimeout(() => {this.scale = 0.3; this.z = 9.5;}, 900);
        setTimeout(() => {this.scale = 0.2; this.z = 9.6;}, 1050);
        setTimeout(() => {this.scale = 0.1; this.z = 9.7;}, 1200);
        setTimeout(() => {this.scale = 0; this.z = 9.8;}, 1350);

        //after 2 seconds the coin must reappear
        setTimeout(() => {this.scale = 0.5; this.z = 9; this.taken = false;}, 3350);
        
    }

}

//circle
class Pipe {

    constructor(position) {

        this.position = position;

    }

}

//triangle
class Slingshot {

    constructor(p1, p2, p3, side) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.side = side;

        this.p12_length = p2.sub(p1).getAbs();

        this.p13_length = p3.sub(p1).getAbs();

        this.p23_length = p3.sub(p2).getAbs();

    }

}

//rectangle
class Cube {

    constructor(p1, p2, p3, p4) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
    }

}


class Flipper {
    constructor(position, number, angle) {
        this.position = position;
        this.number = number;   //0 = right, 1 = left
        this.angle = angle;
    }

    stall = true;
    moving = false;

    getCurrentDirection() {
        return new Vec(Math.cos(utils.degToRad(this.angle)), Math.sin(utils.degToRad(this.angle)));
    }

    getAngularSpeed() {
        if (this.stall)
            return 0;
        if (this.number == 1)
            return utils.degToRad(-FLIPPER_ANGULAR_SPEED);
        return utils.degToRad(FLIPPER_ANGULAR_SPEED);
    }

    
}   