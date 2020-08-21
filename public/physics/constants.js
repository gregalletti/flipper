const FRAMERATE = 60;
const SUBSTEPS = 6;

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

const FLIPPER_DOWN_ANGLE = -30;
const FLIPPER_UP_ANGLE = 30;

const FLIPPER_BOOST = 1;
const BUMPER_BOOST = 1.5;
const WALL_BOOST = 0.7;
const SLINGSHOT_BOOST = 1.5;
const PIPE_BOOST = 0.8;

const BALL_MAX_SPEED = 15;

const T = 1 / FRAMERATE / SUBSTEPS;

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