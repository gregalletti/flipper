var ball = new Ball(new Vec(BALL_DEFAULT_X, BALL_DEFAULT_Y), true, 0);
new Bumper(new Vec(4.6, 6.7));
var cube = new Cube(new Vec(4.1, 10.5), new Vec(5.1, 10.5), new Vec(5.1, 9.5), new Vec(4.1, 9.5));
//new Bumper(new Vec(2.3, 6.7));
//new Bumper(new Vec(3.7, 6.7));
var pipe = new Pipe(new Vec(BALL_DEFAULT_X, 2.2));


function physicsMain() {
    for (let i = 0; i < SUBSTEPS; i++) {

        ball.move();

        
        for (let wall of Wall.list)
            ball.checkWallCollision(wall);

        for (let bumper of Bumper.list)
            ball.checkBumperCollision(bumper);

        ball.checkPipeCollision(pipe);

        ball.checkCubeCollision(cube)
        
    }
    
}