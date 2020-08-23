const FRAMERATE = 60;
const SUBSTEPS = 6;

const X_OFFSET = 2.2;
const Y_OFFSET = 6.7;
const LEFT_OFFSET = - 0.18;
const BASE_Y = 8.53;
const BASE_Z = - 5.97;
const PLANE_INCLINATION = 6.51;

const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 11;
const BALL_RADIUS = 0.16;
const BUMPER_RADIUS = 0.49;
const PIPE_RADIUS = 0.153;
const COIN_RADIUS = 0.249;
const CUBE_EDGE = 1;

//const FLIPPER_LENGTH = .9;
const FLIPPER_LENGTH = 1;
const FLIPPER_HEIGHT = 0.265;

const FLIPPER_ANGULAR_SPEED = 180; //   degrees / seconds
const FLIPPER_DOWN_ANGLE = - 30;
const FLIPPER_UP_ANGLE = 30;

const FLIPPER_BOOST = 1.2;
const BUMPER_BOOST = 1.5;
const WALL_BOOST = 0.7;
const SLINGSHOT_HYP_BOOST = 1.5;
const SLINGSHOT_BOOST = 0.8;
const PIPE_BOOST = 0.8;
const CUBE_BOOST = 0.8;

const BALL_MIN_SPEED = 0.5;
const BALL_MAX_SPEED = 8;

const T = 1 / FRAMERATE / SUBSTEPS;

const DIGIT_UVS = [[0.736, 0.956, 0.761, 0.918, 0.761, 0.956, 0.736, 0.918],
                [0.636, 0.996, 0.661, 0.958, 0.661, 0.996, 0.636, 0.958],
                [0.661, 0.996, 0.686, 0.958, 0.686, 0.996, 0.661, 0.958],
                [0.686, 0.996, 0.711, 0.958, 0.711, 0.996, 0.686, 0.958],
                [0.711, 0.996, 0.736, 0.958, 0.736, 0.996, 0.711, 0.958],
                [0.736, 0.996, 0.761, 0.958, 0.761, 0.996, 0.736, 0.958],
                [0.636, 0.956, 0.661, 0.918, 0.661, 0.956, 0.636, 0.918],
                [0.661, 0.956, 0.686, 0.918, 0.686, 0.956, 0.661, 0.918],
                [0.686, 0.956, 0.711, 0.918, 0.711, 0.956, 0.686, 0.918],
                [0.711, 0.956, 0.736, 0.918, 0.736, 0.956, 0.711, 0.918]];

//lato del cubo = 73


const DEFAULT_CUBE_UVS = [
    0.734015, 0.720873, 
    0.698749, 0.756139, 
    0.698749, 0.720873, 
    0.734015, 0.756139, 
    0.698749, 0.791404, 
    0.698749, 0.756139, 
    0.734015, 0.791404, 
    0.698749, 0.82667, 
    0.698749, 0.791404, 
    0.734015, 0.82667, 
    0.698749, 0.861936, 
    0.698749, 0.82667, 
    0.698749, 0.791404, 
    0.663484, 0.82667, 
    0.663484, 0.791404, 
    0.769281, 0.791404, 
    0.734015, 0.82667, 
    0.734015, 0.791404, 
    0.734015, 0.756139, 
    0.734015, 0.791404, 
    0.734015, 0.82667, 
    0.734015, 0.861936, 
    0.698749, 0.82667, 
    0.769281, 0.82667]
/*
const HEART_CUBE_UVS = [
    0.465, 0.591, 0.5, 0.591, 0.5, 0.556, 0.465, 0.556,
    0.429, 0.556, 0.465, 0.556, 0.465, 0.521, 0.429, 0.521,
    0.465, 0.556, 0.5, 0.556, 0.5, 0.521, 0.465, 0.521,
    0.5, 0.556, 0.535, 0.556, 0.535, 0.521, 0.5, 0.521,
    0.465, 0.521, 0.5, 0.521, 0.465, 0.486, 0.5, 0.486,
    0.465, 0.486, 0.5, 0.486, 0.465, 0.450, 0.5, 0.450
];
*/
/*
const HEART_CUBE_UVS = [
    0.734015, 0.720873,
    0.698749, 0.756139,
    0.698749, 0.720873,
    0.734015, 0.756139,
    0.698749, 0.791404,
    0.734015, 0.791404,
    0.698749, 0.826670,
    0.734015, 0.826670,
    0.698749, 0.861936,
    0.663484, 0.826670,
    0.663484, 0.791404,
    0.769281, 0.791404,
    0.734015, 0.861936,
    0.769281, 0.826670
];
*/
const STAR_CUBE_UVS = [0.736, 0.956, 0.761, 0.918, 0.761, 0.956, 0.736, 0.918,
0.636, 0.996, 0.661, 0.958, 0.661, 0.996, 0.636, 0.958,
0.661, 0.996, 0.686, 0.958, 0.686, 0.996, 0.661, 0.958,
0.686, 0.996, 0.711, 0.958];
    /*
const STAR_CUBE_UVS = [
    [0.465, 0.591, 0.5, 0.591, 0.5, 0.556, 0.465, 0.556],
    [0.429, 0.556,  0.465, 0.556, 0.465, 0.521, 0.429, 0.521],
    [0.465, 0.556, 0.5, 0.556, 0.5, 0.521, 0.465, 0.521],
    [0.5, 0.556, 0.535, 0.556, 0.535, 0.521, 0.5, 0.521],
    [0.465, 0.521, 0.5, 0.521, 0.465, 0.486, 0.5, 0.486],
    [0.465, 0.486, 0.5, 0.486, 0.465, 0.450, 0.5, 0.450]
];*/