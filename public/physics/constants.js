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

const BUMPER_SCORE = 10;
const SLINGSHOT_HYP_SCORE = 15;
const COIN_SCORE = 1000;
const CUBE_SCORE = 10;

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

const HEART_CUBE_UVS = [
    0.499642, 0.449997, 
    0.463898, 0.485404, 
    0.463898, 0.449997, 
    0.499642, 0.485404, 
    0.463898, 0.52081, 
    0.463898, 0.485404, 
    0.499642, 0.52081, 
    0.463898, 0.556217, 
    0.463898, 0.52081, 
    0.499642, 0.556217, 
    0.463898, 0.591624, 
    0.463898, 0.556217, 
    0.463898, 0.52081, 
    0.428156, 0.556217, 
    0.428156, 0.52081, 
    0.535386, 0.52081, 
    0.499642, 0.556217, 
    0.499642, 0.52081, 
    0.499642, 0.485404, 
    0.499642, 0.52081, 
    0.499642, 0.556217, 
    0.499642, 0.591624, 
    0.463898, 0.556217, 
    0.535386, 0.556217
];



const STAR_CUBE_UVS = [
    0.663032, 0.4491, 
    0.627688, 0.484673, 
    0.627688, 0.4491, 
    0.663032, 0.484673, 
    0.627688, 0.520244, 
    0.627688, 0.484673, 
    0.663032, 0.520244, 
    0.627688, 0.555817, 
    0.627688, 0.520244,
    0.663032, 0.555817,
    0.627688, 0.591389,
    0.627688, 0.555817,
    0.627688, 0.520244,
    0.592345, 0.555817,
    0.592345, 0.520244,
    0.698375, 0.520244, 
    0.663032, 0.555817, 
    0.663032, 0.520244, 
    0.663032, 0.484673, 
    0.663032, 0.520244, 
    0.663032, 0.555817, 
    0.663032, 0.591389, 
    0.627688, 0.555817, 
    0.698375, 0.555817
]
;