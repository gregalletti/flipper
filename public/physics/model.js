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
const SPHERE_RADIUS = 1.59;
const FRICTION = .02;
const DRAG = .012;
//const FLIPPER_LENGTH = .9;
const FLIPPER_LENGTH = 1;
const FLIPPER_HEIGHT = 0.265;
const BALL_DEFAULT_X = 4.6;
const BALL_DEFAULT_Y = 2;
const WALL_RESTITUTION = -.5;
const FLIPPER_DOWN_ANGLE = -30;
const FLIPPER_UP_ANGLE = 30;
const BUMPER_RESTITUTION = -1.4;
const FLIPPER_SWEEP_TIME = .12;
const FLIPPER_BOOST = 1;
const BUMPER_BOOST = 1.5;
const WALL_BOOST = 0.5;
const SLINGSHOT_BOOST = 1.5;
const OBSTACLE_BOOST = 0.8;
const CRITICAL_VELOCITY = BALL_RADIUS * FRAMERATE;
const SAFE_VELOCITY = .5 * CRITICAL_VELOCITY * SUBSTEPS;
const GRAVITATIONAL_ACCELERATION = 9.8;

var score = 0;
var lives = 3;
var balls = 1;

//position, velocity, ...
class Vector {

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

    static NULL = new Vector(0, 0);

    /**
     * Creates a unit vector whose phase is given.
     * @param {number} angle the phase of the vector
     */
    static unit(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    /**
     * Returns the result of component-wise (euclidean) addition with another vector.
     * @param {Vector} vector the other vector
     */
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Returns the scaling of the vector by a given factor.
     * @param {number} factor the scaling factor
     */
    scale(factor) {
        return new Vector(factor * this.x, factor * this.y);
    }

    /**
     * Returns the normalization of the vector.
     */
    unit() {
        return new Vector(Math.cos(this.phase), Math.sin(this.phase));
    }

    /**
     * Returns the result of component-wise (euclidean) subtraction with another vector.
     * @param {Vector} vector the other vector
     */
    sub(vector) {
        return this.add(vector.scale(-1));
    }

    /**
     * Returns the normalization of the vector.
     */
    normalize() {
        return new Vector(Math.cos(this.phase), Math.sin(this.phase));
    }

    /**
     * Returns the dot product with another vector.
     * @param {Vector} vector the other vector.
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Returns the counterclockwise normal of the vector.
     */
    normal() {
        return new Vector(-this.y, this.x);
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
   
    constructor(position, radius) {

        this.position = position;
        this.radius = radius;

        Bumper.list.push(this);
    }

    static list = [];
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
class Obstacle {
   
    constructor(p1, p2, p3, p4) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;

        this.p12_length = p2.sub(p1).abs;
        this.p12_direction = p2.sub(p1).normalize();
        
        this.p23_length = p3.sub(p2).abs;
        this.p23_direction = p3.sub(p2).normalize();
        
        this.p34_length = p4.sub(p3).abs;
        this.p34_direction = p4.sub(p3).normalize();
      
        this.p41_length = p1.sub(p4).abs;
        this.p41_direction = p1.sub(p4).normalize();

        Obstacle.list.push(this);
    }

    static list = [];
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

//circle
class Ball {

    position = new Vector(BALL_DEFAULT_X, BALL_DEFAULT_Y);

    velocity = new Vector(0, 0);

    launched = false;

    update(gravity, dt) {
        const CENTER_SEEKING_FORCE = .4;
        this.velocity = this.velocity.add(gravity.scale(dt)).sub(this.velocity.unit().scale(FRICTION * dt)).sub(this.velocity.scale(this.velocity.abs * DRAG * dt));
        if(this.position.x < 1.52 && this.launched)
            this.velocity = this.velocity.add(new Vector(CENTER_SEEKING_FORCE, 0).scale(dt));
        else if(this.position.x > 3.5 && this.launched)
            this.velocity = this.velocity.sub(new Vector(CENTER_SEEKING_FORCE, 0).scale(dt));

        if(this.velocity.abs > SAFE_VELOCITY)
            this.velocity = this.velocity.unit().scale(SAFE_VELOCITY);

        this.position = this.position.add(this.velocity.scale(dt));

        if(this.position.y < -2 * BALL_RADIUS) {
            if(lives > 1) {
                this.position = new Vector(BALL_DEFAULT_X, BALL_DEFAULT_Y);
                this.launched = false;
                lives--;
                updateBallCounter(lives, false);
                playSound(soundReload);
            } else if(lives == 1)
                updateBallCounter(0, true);
            this.velocity = Vector.NULL;
        }
    }

    checkWallCollision(wall) {
        let relativeToStart = this.position.sub(wall.start);
        let wallAbscissa = relativeToStart.dot(wall.direction);
        wallAbscissa = Math.max(0, Math.min(wallAbscissa, wall.length)); // clamp wallAbscissa in [0, length]
        let impactPoint = wall.direction.scale(wallAbscissa).add(wall.start);

        let hit = this.handleCollision(impactPoint, Vector.NULL, WALL_RESTITUTION, 0);

        if(hit) {
            if(this.velocity.abs < 1 || this.position.y < 1.4 && Math.abs(this.velocity.y) < 1)
                return;
            let i = Math.floor(3 * Math.random());
            //let sound = [soundWall1, soundWall2, soundWall3][i];
            //playSound(sound);
        }
    }

    checkBumperCollision(bumper) {
        let bumperCenterToBall = this.position.sub(bumper.position);
        let bumperCenterToImpactPoint = bumperCenterToBall.unit().scale(BUMPER_RADIUS);
        let impactPoint = bumperCenterToImpactPoint.add(bumper.position);

        let hit = this.handleCollision(impactPoint, Vector.NULL, BUMPER_RESTITUTION, 0);
        if(hit) {
            score += Date.now() % 61;
            let i = Math.floor(3 * Math.random());
            //let sound = [soundBumper1, soundBumper2, soundBumper3][i];
            //playSound(sound);
        }
    }

    checkFlipperCollision(flipper) {
        let relativeToHinge = this.position.sub(flipper.position);
        let flipperAbscissa = relativeToHinge.dot(flipper.direction);
        flipperAbscissa = Math.max(0, Math.min(flipperAbscissa, FLIPPER_LENGTH)); // clamp flipperAbscissa in [0, length]
        let impactPoint = flipper.direction.scale(flipperAbscissa).add(flipper.position);
        let impactPointVelocity = flipper.direction.normal().scale(flipperAbscissa * flipper.pulse); // apply rivals theorem: new basis rotating with flipper

        let hit = this.handleCollision(impactPoint, impactPointVelocity, FLIPPER_RESTITUTION, FLIPPER_ENERGY_TRANSFER_EFFICIENCY);

        if(hit) {
            if(this.velocity.abs < 1 || this.position.y < 1.4 && Math.abs(this.velocity.y) < 1)
                return;
            let i = Math.floor(3 * Math.random());
            //let sound = [soundWall1, soundWall2, soundWall3][i];
            //playSound(sound);
        }
    }

    checkObstacleCollision(obstacle) {}
    checkSlingshotCollision(slingshot) {}

    handleWallCollision() {}
    handleBumperCollision() {}
    handleFlipperCollision() {}
    handleObstacleCollision() {}
    handleSlingshotCollision() {}



    /**
     * Updates the ball's position and velocity considering a collision with a flat surface in a neighbourhood of a given impact point
     * @param {Vector} impactPoint the position of the point of impact
     * @param {Vector} impactPointVelocity the velocity of the point of impact on the moving surface (null vector if stationary)
     * @param {number} restitution the ratio between the ball's velocity's normal-to-the-surface component before vs. after the impact
     * @param {number} energyTransferEfficiency the portion of the kinetic energy transferred from the surface to the ball, if the surface is moving
     */
    handleCollision(impactPoint, impactPointVelocity, restitution, energyTransferEfficiency) {
        let relativePosition = this.position.sub(impactPoint);
        let distance = relativePosition.abs;

        if (distance >= BALL_RADIUS)
            return false;

        // "bounce" the ball out of the surface along a line connecting the impact point to the center of the ball (i.e. normal to the surface)
        let normal = relativePosition.unit();
        let penetration = BALL_RADIUS - distance;
        distance = BALL_RADIUS + penetration;
        relativePosition = normal.scale(distance);
        this.position = impactPoint.add(relativePosition);

        // adjust velocity ~ restitution and energy transfer efficiency only apply to the normal component of the relative velocity
        let relativeVelocity = this.velocity.sub(impactPointVelocity);
        let tangent = normal.normal(); // sounds dodgy but it's true
        let velocityTangent = relativeVelocity.dot(tangent);
        let velocityNormal = relativeVelocity.dot(normal);
        velocityNormal *= restitution;
        velocityNormal += 2 * impactPointVelocity.abs * energyTransferEfficiency;
        relativeVelocity = normal.scale(velocityNormal).add(tangent.scale(velocityTangent));
        this.velocity = impactPointVelocity.add(relativeVelocity);
        return true;
    }

    launch(force) {
        if(this.launched)
            return;
        this.velocity = new Vector(0, force * BALL_LAUNCH_SPEED);
        this.launched = true;
        playSound(soundLaunch);
    }
}
