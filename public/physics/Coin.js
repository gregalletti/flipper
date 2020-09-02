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