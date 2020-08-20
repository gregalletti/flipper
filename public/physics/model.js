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

const FRAMERATE = 60;
const SUBSTEPS = 6;

const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 11;
const BALL_RADIUS = 0.16;
const BUMPER_RADIUS = 0.33;
const PIPE_RADIUS = 0.19;
const CUBE_EDGE = 1;

//const FLIPPER_LENGTH = .9;
const FLIPPER_LENGTH = 1;
const FLIPPER_HEIGHT = 0.265;
const BALL_DEFAULT_X = 4.6;
const BALL_DEFAULT_Y = 2;

const FLIPPER_DOWN_ANGLE = -30;
const FLIPPER_UP_ANGLE = 30;

const FLIPPER_BOOST = 1;
const BUMPER_BOOST = 1.5;
const WALL_BOOST = 0.5;
const SLINGSHOT_BOOST = 1.5;
const OBSTACLE_BOOST = 0.8;

const BALL_MAX_SPEED = 20;

var T = 1 / FRAMERATE / SUBSTEPS;

const DIGIT_UVS = [
    [1510,87, 1562,87, 1510,168, 1562,168],

    [1302,6, 1354,6, 1302,87, 1354,87], //digit larga 52, alta 81
    [1354,6, 1406,6, 1354,87, 1406,87],
    [1406,6, 1458,6, 1406,87, 1458,87],
    [1458,6, 1510,6, 1458,87, 1510,87],
    [1510,6, 1562,6, 1510,87, 1562,87],

    [1302,87, 1354,87, 1302,168, 1354,168], 
    [1354,87, 1406,87, 1354,168, 1406,168],
    [1406,87, 1458,87, 1406,168, 1458,168],
    [1458,87, 1510,87, 1458,168, 1510,168]
];

//lato del cubo = 73

const DEFAULT_CUBE_UVS = [
    [1431,284, 1504,284, 1431,356, 1504,356],
    [],
    [],
    [],
    [],
    []
];
const HEART_CUBE_UVS = [
    [],
    [],
    [],
    [],
    [],
    []
];
const STAR_CUBE_UVS = [
    [],
    [],
    [],
    [],
    [],
    []
];


var score = 0;
var lives = 3;
var balls = 1;

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

    move() {

        var G = new Vec(0, 1);

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
                    this.coords = new Vec(BALL_DEFAULT_X, BALL_DEFAULT_Y);
                    this.ready = false;                    
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



    launch(force) {
        if (!this.ready)
            return;
        this.speed = new Vec(0, force * BALL_LAUNCH_SPEED);
        this.ready = false;
    }
}

//line
class Wall {
    constructor(start, end) {

        this.start = start;
        this.end = end;
        this.length = end.sub(start).abs;
        this.direction = end.sub(start).normalize();

        Wall.list.push(this);
    }

    static list = [];
}

//circle
class Bumper {

    constructor(position) {

        this.position = position;

        Bumper.list.push(this);
    }

    static list = [];
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

        Slingshot.list.push(this);
    }

    static list = [];
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
    constructor(position, number) {
        this.position = position;
        this.number = number;

        Flipper.list.push(this);
    }

    static list = [];

    up = false;
    moving = false;
    angleRatio = 0;

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

    update(dt) {
        let pulseDirection = this.active ? 1 : -1;
        let rawAngleRatio = this.angleRatio + pulseDirection * dt / FLIPPER_SWEEP_TIME;
        if (rawAngleRatio >= 0 && rawAngleRatio <= 1) {
            this.angleRatio = rawAngleRatio;
            this.isMoving = true;
        }
        else this.isMoving = false;
    }
}