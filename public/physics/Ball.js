//circle
class Ball {

    constructor(coords, ready, number) {

        this.coords = coords;
        this.ready = ready;
        this.number = number;
    }

    active = false;
    speed = new Vec2(0, 0);
    onRamp = false;

    launch() {
        if (!this.ready || ball2.active)
            return;

        this.speed = new Vec2(0, Math.min(power, BALL_MAX_SPEED)); 
        play(ballRoll)
        ballRoll.volume = 0.1;
        this.ready = false;
        this.active = true;
        play(letsGo);
    }

    move() {
       
        //apply some gravity to the ball speed
        this.speed = this.speed.add(new Vec2(0, - 0.017));

        if(this.coords.x > RAMP_START_X && this.coords.y > RAMP_START_Y && rampActive)
            this.onRamp = true;
        else
            this.onRamp = false;
            
        if(this.onRamp)
            this.speed = this.speed.add(new Vec2(0, - 0.002));

        if(this.coords.x > 4.5)
            this.speed = this.speed.add(new Vec2(- 0.005, 0));

        if(this.coords.x < 0.5)
            this.speed = this.speed.add(new Vec2(0.005, 0));
/*
        if(this.coords.x > 3.6 && this.coords.y < 1.65)
            this.speed = this.speed.add(new Vec2(- 0.005, 0));

        if(this.coords.x < 1.4 && this.coords.y < 1.65)
            this.speed = this.speed.add(new Vec2(0.005, 0));
*/
        //limit the ball speed to avoid crazy things
        if(this.speed.getModule() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
        
        //increase the ball speed to avoid blocking
        if(this.speed.getModule() < BALL_MIN_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MIN_SPEED);
        
        //apply velocity (for the time interval) to the ball coords
        this.coords = this.coords.add(this.speed.scale(0.003));

        //check if the ball falls out
        if(this.coords.y < 0.5) {            
            //if both balls were on the board then no problem
            if(ball.active && ball2.active) {
                //just remove the ball and go on
                this.speed = new Vec2(0,0);
                if(this.number == 0) {
                    this.coords = new Vec2(4.6, 2);
                    angleY1 = 0;
                    angleZ1 = 0;
                    showBall = false;
                }
                else {
                    this.coords = new Vec2(2.3, 9.3);
                    angleY2 = 0;
                    angleZ2 = 0;
                    stopAudio(bonusSound);
                    ballRoll.volume = 0.1;

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
                    this.speed = new Vec2(0,0);
                    if(this.number == 0)
                        this.coords = new Vec2(4.6, 2);
                    else{
                        this.coords = new Vec2(2.3, 9.3);
                        stopAudio(bonusSound);
                    }
                    showBall = true;

                    ballBounce = 0.2;
                    setTimeout(() => {ballBounce = 0.15;},  300);            
                    setTimeout(() => {ballBounce = 0.10;},  600);
                    setTimeout(() => {ballBounce = 0.05;},  900);
                    setTimeout(() => {ballBounce = 0;},     1200);

                    angleY1 = 0;
                    angleZ1 = 0;
                    angleY2 = 0;
                    angleZ2 = 0;
                    this.ready = true;
                    this.active = false;
                    play(gameoverSound); 
                    play(ballLoad); 


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

    checkRampCollision(ramp) {

        var fromLeft = true;
        if(this.coords.x >= ramp.start.x)
            fromLeft = false;
        
            // get dot product of the line and circle
        let dot = (((this.coords.x - ramp.start.x)*(ramp.end.x - ramp.start.x)) + ((this.coords.y - ramp.start.y)*(ramp.end.y - ramp.start.y)) ) / Math.pow(ramp.length, 2);
    
        // find the closest point on the line
        let closestX = ramp.start.x + (dot * (ramp.end.x - ramp.start.x));
        let closestY = ramp.start.y + (dot * (ramp.end.y - ramp.start.y));
    
        // get distance to closest point
        let distX = closestX - this.coords.x;
        let distY = closestY - this.coords.y;
        let distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
                this.handleRampCollision(ramp, closestX, closestY, distance, fromLeft);
        }
        return;
  
    }

    handleRampCollision(ramp, closestX, closestY, distance, fromLeft) {

        let error = BALL_RADIUS - distance;        

        if(isBetweenY(ramp.start, ramp.end, closestX, closestY)){
                
            this.speed = this.speed.invertX().scale(WALL_BOOST);                
            this.coords = fromLeft ? this.coords.add(new Vec2(-error, 0)) : this.coords = this.coords.add(new Vec2(error, 0));  
            
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
                    this.coords = this.coords.add(new Vec2(0, error));
                else{
                    this.coords = this.coords.add(new Vec2(0, - error));
                    if(this.onRamp){
                        //goomba tuonato
                        rampMovingDown = true;
                        currentScore += 50000;
                        play(goombaSound);
                    }
                }
            }
        }
        else {
            if(isBetweenY(wall.start, wall.end, closestX, closestY)){
                
                this.speed = this.speed.invertX().scale(WALL_BOOST);
                
                if(wall.number == 2)
                    this.coords = this.coords.add(new Vec2(error, 0));
                else
                    this.coords = this.coords.add(new Vec2(- error, 0));  
            }
        } 

    }


    checkBumperCollision(bumper) {

        let distance = this.coords.sub(bumper.position);
        
        if (distance.getModule() <= BALL_RADIUS + BUMPER_RADIUS) {
            play(bumperSound);
            this.handleBumperCollision(bumper, distance);
            pLight.makeLight(bumper.position, "#ff0000", "bumper"+bumper.num);
        }
        return;
    }

    handleBumperCollision(bumper, distance) {

        let impactPoint = (distance.normalize().scale(BUMPER_RADIUS)).add(bumper.position);

        //calculate normal and tangent vector 
        let N = this.coords.sub(impactPoint).normalize();
        let T = N.normal();

        let error = BALL_RADIUS + BUMPER_RADIUS - distance.getModule();
        let offset = N.scale(BALL_RADIUS + error);
        this.coords = impactPoint.add(offset);


        //speed is composed by the 2 components
        let oldSpeed = this.speed.scale(BUMPER_BOOST);
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));
        
        //limit the ball speed to avoid crazy things
        if(this.speed.getModule() > BALL_MAX_SPEED)
        this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);

        currentScore += BUMPER_SCORE;
     }


    checkPipeCollision(pipe) { 

        let distance = this.coords.sub(pipe.position);
        
        if (distance.getModule() <= BALL_RADIUS + PIPE_RADIUS) {
            play(kick);
            this.handlePipeCollision(pipe, distance);
            pLight.makeLight(pipe.position, "#000000", "pipe");
        }
        return;
    }

    handlePipeCollision(pipe, distance) {

        let impactPoint = (distance.normalize().scale(PIPE_RADIUS)).add(pipe.position);

        //calculate normal and tangent vector 
        let N = this.coords.sub(impactPoint).normalize();
        let T = N.normal();

        let error = BALL_RADIUS + PIPE_RADIUS - distance.getModule();
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
            pLight.makeLight(new Vec2((cube.p1.x+cube.p2.x+cube.p3.x+cube.p4.x)/4,
                                   (cube.p1.y+cube.p2.y+cube.p3.y+cube.p4.y)/4), "#ffffff", "cube"); 
        }
        return;
    }

    handleCubeCollision(cube, edge, distance) { 

        let error = BALL_RADIUS - distance;

        if(edge == 0)   {
            this.coords = this.coords.add(new Vec2(- error, 0));
            this.speed = this.speed.invertX();
        }
        else if (edge == 1)    {
            this.coords = this.coords.add(new Vec2(0, error));  
            this.speed = this.speed.invertY();
        }
        else if (edge == 2)    {
            this.coords = this.coords.add(new Vec2(error, 0)); 
            this.speed = this.speed.invertX();
        } 
        else if (edge == 3)    {
            this.coords = this.coords.add(new Vec2(0, - error));  
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
                play(bonusSound);
                ballRoll.volume = 0;
                currentCubeTex = STAR_CUBE_UVS;
                if(ball2.active){
                    //play(magicCubeSound);
                    currentScore += 100;
                }
                else{
                    ball2.active = true;
                    ball2.ready = false;
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
        let N = slingshot.side == 0 ? new Vec2(- Math.sqrt(2) / 2, Math.sqrt(2) / 2) : new Vec2(Math.sqrt(2) / 2, Math.sqrt(2) / 2);

        this.speed = N.scale(this.speed.getModule()).scale(SLINGSHOT_HYP_BOOST);


        /*
        //speed is composed by the 2 components
        let oldSpeed = this.speed.scale(SLINGSHOT_HYP_BOOST);
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));
        */

            currentScore += SLINGSHOT_HYP_SCORE;

            let errorXY = error * Math.sqrt(2) / 2;
            this.coords = slingshot.side == 0 ? this.coords.add(new Vec2(- errorXY, errorXY)) : this.coords.add(new Vec2(errorXY, errorXY));
        
            pLight.makeLight(slingshot.p1, "#00ff00", slingshot.side == 0 ? "rSlingshot" : "lSlingshot");
        }
        else if(num == 1)   {
            this.speed = (this.speed.invertX().scale(SLINGSHOT_BOOST));
            this.coords = slingshot.side == 0 ? this.coords.add(new Vec2(error, 0)) : this.coords.add(new Vec2(- error, 0));
        }
        else    {

            this.speed = (this.speed.invertY().scale(SLINGSHOT_BOOST));
            this.coords = this.coords.add(new Vec2(0, - error));
        }

        //limit the ball speed to avoid crazy things
        if(this.speed.getModule() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
    }


    checkBallCollision(ball) { 
        
        let distance = this.coords.sub(ball.coords);
        
        if (distance.getModule() <= BALL_RADIUS * 2) {
            this.handleBallCollision(ball, distance);
        }
        return;
    }

    handleBallCollision(ball, distance) { 

        let error = BALL_RADIUS * 2 - distance.getModule();
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
        if (realDistance.getModule() <= BALL_RADIUS){
            this.handleFlipperCollision(flipper, realDistance, impactPoint, projectionX);
        }
    }

    handleFlipperCollision(flipper, realDistance, impactPoint, projectionX) {

        let impactPointSpeed = flipper.getCurrentDirection().normal().scale(projectionX * flipper.getAngularSpeed()); //alan facchinetti way
        let N = realDistance.normalize();
        
        let error = BALL_RADIUS - realDistance.getModule();
        let offset = N.scale(BALL_RADIUS + error);
        this.coords = impactPoint.add(offset);

        let newSpeed = this.speed.sub(impactPointSpeed);
        let T = N.normal(); 
        let vT = newSpeed.dot(T);
        let vN = newSpeed.dot(N);
        
        if(impactPointSpeed.getModule() != 0){
            vN += 5 * impactPointSpeed.getModule() + 1.8;
            newSpeed = N.scale(vN).add(T.scale(vT));
            this.speed = newSpeed.sub(impactPointSpeed);
        }
        else{
            this.speed = T.scale(vT).sub(N.scale(vN).scale(FLIPPER_BOOST));
            console.log("dio")

            if(this.speed.getModule() < BALL_MIN_SPEED)
                this.speed = this.speed.normalize().scale(BALL_MIN_SPEED);
        }


/*      INSTABILE, COMMENTATA PER ORA
        let vT = oldSpeed.dot(T);
        let vN = oldSpeed.dot(N);

        this.speed = (T.scale(vT).sub(N.scale(vN)));     

        //limit the ball speed to avoid crazy things
        if(this.speed.getModule() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
            */
    }


     checkCoinCollision(coin) { 
        let distance = this.coords.sub(coin.position);
        
        if (distance.getModule() <= BALL_RADIUS + COIN_RADIUS) {
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

}