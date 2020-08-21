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

    static NULL = new Vec(0, 0);

    static unit(angle) {
        return new Vec(Math.cos(angle), Math.sin(angle));
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
}

//circle
class Ball {

    constructor(coords, ready, number) {

        this.coords = coords;
        this.ready = ready;
        this.number = number;
    }

    speed = new Vec(0, 0);

    launch() {
        if (!this.ready)
            return;
        this.speed = new Vec(0, power);
        this.ready = false;
    }

    move() {

        var G = new Vec(0, -2);

        //apply gravity (for the time interval) to the ball speed
        this.speed = this.speed.add(G.scale(T));

        //limit the ball speed to avoid crazy things
        if(this.speed.getAbs() > BALL_MAX_SPEED)
            this.speed = this.speed.normalize().scale(BALL_MAX_SPEED);
        
        //apply velocity (for the time interval) to the ball coords
        this.coords = this.coords.add(this.speed.scale(T));

        //check if the ball falls out
        if(this.coords.y < -2) {
            if(balls > 1) {
                //just remove the ball and go on
                balls--;
                //rimuovere in qualche modo la pallina
            }
            else if(balls == 1) {
                if(lives > 1) {
                    //prepare the next ball and update lives
                    lives--;
                    this.speed = new Vec(0,0);
                    this.coords = new Vec(4.6, 2);
                    this.ready = true;
                }
                else if(lives == 1)
                    console.log("game over")    
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
            this.handleWallCollision(wall);
        }
        return;
  
    }

    handleWallCollision(wall) {
        console.log("WALL")
        
    }


    checkBumperCollision(bumper) {
        // get distance between the circle's centers
        // use the Pythagorean Theorem to compute the distance
        let distX = this.coords.x - bumper.position.x;
        let distY = this.coords.y - bumper.position.y;
        let distance = Math.sqrt( (distX * distX) + (distY * distY) );

        // if the distance is less than the sum of the circle's
        // radii, the circles are touching!
        if (distance <= BALL_RADIUS + BUMPER_RADIUS) {
            this.handleBumperCollision(bumper);
        }
        return;
    }

    handleBumperCollision(bumper) {
        console.log("BUMPER")

     }


    checkPipeCollision(pipe) { 
        // get distance between the circle's centers
        // use the Pythagorean Theorem to compute the distance
        let distX = this.coords.x - pipe.position.x;
        let distY = this.coords.y - pipe.position.y;
        let distance = Math.sqrt( (distX * distX) + (distY * distY) );

        // if the distance is less than the sum of the circle's
        // radii, the circles are touching!
        if (distance <= BALL_RADIUS + PIPE_RADIUS) {
            this.handlePipeCollision(pipe);
        }
        return;
    }

    handlePipeCollision(pipe) {
        console.log("PIPE")

     }


    checkCubeCollision(cube) { 
        //p1 is the TOP LEFT point of the square
        // temporary variables to set edges for testing
        let testX = this.coords.x;
        let testY = this.coords.y;

        // which edge is closest?
        if (this.coords.x < cube.p1.x)         
            testX = cube.p1.x;      // test left edge
        else if (this.coords.x > cube.p1.x + CUBE_EDGE) 
            testX = cube.p1.x + CUBE_EDGE;   // right edge

        if (this.coords.y > cube.p1.y)         
            testY = cube.p1.y;      // top edge
        else if (this.coords.y < cube.p1.y - CUBE_EDGE) 
            testY = cube.p1.y - CUBE_EDGE;   // bottom edge

        // get distance from closest edges
        let distX = this.coords.x - testX;
        let distY = this.coords.y - testY;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );

        // if the distance is less than the radius, collision!
        if (distance <= BALL_RADIUS) {
            this.handleCubeCollision(cube);
        }
        return;
    }

    handleCubeCollision(cube) { 
        console.log("CUBE")
        this.speed = this.speed.scale(-1);

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
            this.handleSlingshotCollision(slingshot, true); //bounce
        }
        
        //P2-P3
        dot = (((this.coords.x - slingshot.p2.x)*(slingshot.p3.x - slingshot.p2.x)) + ((this.coords.y - slingshot.p2.y)*(slingshot.p3.y - slingshot.p2.y)) ) / Math.pow(slingshot.p23_length, 2);
    
        closestX = slingshot.p2.x + (dot * (slingshot.p3.x - slingshot.p2.x));
        closestY = slingshot.p2.y + (dot * (slingshot.p3.y - slingshot.p2.y));
    
        distX = closestX - this.coords.x;
        distY = closestY - this.coords.y;
        distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
            this.handleSlingshotCollision(slingshot, false); //no bounce
        }
        
        //P1-P3
        dot = (((this.coords.x - slingshot.p1.x)*(slingshot.p3.x - slingshot.p1.x)) + ((this.coords.y - slingshot.p1.y)*(slingshot.p3.y - slingshot.p1.y)) ) / Math.pow(slingshot.p13_length, 2);
    
        closestX = slingshot.p1.x + (dot * (slingshot.p3.x - slingshot.p1.x));
        closestY = slingshot.p1.y + (dot * (slingshot.p3.y - slingshot.p1.y));
    
        distX = closestX - this.coords.x;
        distY = closestY - this.coords.y;
        distance = Math.sqrt((distX * distX) + (distY * distY));
    
        if (distance <= BALL_RADIUS) {
            this.handleSlingshotCollision(slingshot, false); //no bounce
        }
        return;
    }

    handleSlingshotCollision(slingshot, bounce) { 
        console.log("SLING")

    }


    checkBallCollision(ball) { 
        // get distance between the circle's centers
        // use the Pythagorean Theorem to compute the distance
        let distX = this.coords.x - ball.coords.x;
        let distY = this.coords.y - ball.coords.y;
        let distance = Math.sqrt( (distX * distX) + (distY * distY) );

        // if the distance is less than the sum of the circle's
        // radii, the circles are touching!
        if (distance <= BALL_RADIUS * 2) {
            this.handleBallCollision(ball);
        }
        return;
    }

    handleBallCollision(ball) { 
        console.log("BALL")

    }

     
    checkFlipperCollision(flipper) { }

    handleFlipperCollision() {
        console.log("FLIPPER")

     }


     checkCoinCollision(coin) { 
        // get distance between the circle's centers
        // use the Pythagorean Theorem to compute the distance
        let distX = this.coords.x - coin.position.x;
        let distY = this.coords.y - coin.position.y;
        let distance = Math.sqrt( (distX * distX) + (distY * distY) );

        // if the distance is less than the sum of the circle's
        // radii, the circles are touching!
        if (distance <= BALL_RADIUS + COIN_RADIUS) {
            this.handleCoinCollision(coin);
        }
        return;
    }

    handleCoinCollision(coin) { 
        console.log("COIN")
        coin.scale = 0;

    }
}

//line
class Wall {
    constructor(start, end) {

        this.start = start;
        this.end = end;
        this.length = end.sub(start).abs;
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

    rotate() { 
        console.log(this.rotationAngle)
        this.rotationAngle = this.rotationAngle + 0.02;
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

    constructor(p1, p2, p3) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        this.p12_length = p2.sub(p1).abs;
        this.p12_direction = p2.sub(p1).normalize();

        this.p13_length = p3.sub(p1).abs;
        this.p13_direction = p3.sub(p1).normalize();

        this.p23_length = p3.sub(p2).abs;
        this.p23_direction = p3.sub(p2).normalize();

    }

}

//rectangle
class Cube {

    constructor(p1, p2, p3, p4) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;

        this.p12_direction = p2.sub(p1).normalize();

        this.p23_direction = p3.sub(p2).normalize();

        this.p34_direction = p4.sub(p3).normalize();

        this.p41_direction = p1.sub(p4).normalize();

    }

}


class Flipper {
    constructor(position, number, angle) {
        this.position = position;
        this.number = number;
        this.angle = angle;
    }

    up = false;
    moving = false;

    getCurrentAngle() {
        let leftAngle = FLIPPER_RESTING_ANGLE + (FLIPPER_ACTIVE_ANGLE - FLIPPER_RESTING_ANGLE) * this.angleRatio;
        return this.isLeft ? leftAngle : Math.PI - leftAngle;
    }

    getCurrentDirection() {
        return Vector.unit(this.angle);
    }

    getExtremityDirection() {
        return this.direction.scale(FLIPPER_LENGTH).add(this.position);
    }

    getVelocity() {
        if (!this.isMoving)
            return 0;
        if (this.isLeft ^ this.active)
            return -FLIPPER_PULSE;
        return FLIPPER_PULSE;
    }

    rotate() {
        let pulseDirection = this.active ? 1 : -1;
        let rawAngleRatio = this.angleRatio + pulseDirection * T / 1;
        if (rawAngleRatio >= 0 && rawAngleRatio <= 1) {
            this.angleRatio = rawAngleRatio;
            this.isMoving = true;
        }
        else this.isMoving = false;
    }
}