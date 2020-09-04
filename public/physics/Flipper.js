class Flipper {
    constructor(position, number, angle) {
        this.position = position;
        this.number = number;   //0 = right, 1 = left
        this.angle = angle;
    }

    stall = true;
    moving = false;

    getCurrentDirection() {
        return new Vec2(Math.cos(utils.degToRad(this.angle)), Math.sin(utils.degToRad(this.angle)));
    }

    getAngularSpeed() {
        if (this.stall)
            return 0;
        if (this.number == 1)
            return utils.degToRad(- FLIPPER_ANGULAR_SPEED);
        return utils.degToRad(FLIPPER_ANGULAR_SPEED);
    }

    
}   