/* 
    MakeWorld: function (tx, ty, tz, rx, ry, rz, s)

    t: traslazione
    r: rotazione
    s: scaling
*/

var ballLocalMatrix         = utils.MakeWorld( 0,         0,        0,           0,        0,       0,     1); // #0
var bodyLocalMatrix         = utils.MakeWorld( 0,         0,        0,           0,        0,       0,     1);
var bumper1LocalMatrix      = utils.MakeWorld( 1.1819,    9.1362,   0.020626,   -6.51,     0,       0,     1);
var bumper2LocalMatrix      = utils.MakeWorld(-1.5055,    9.1362,   0.020626,   -6.51,     0,       0,     1);
var bumper3LocalMatrix      = utils.MakeWorld(-0.11626,   9.1362,   -1.020626,  -6.51,     0,       0,     1);
var dl1LocalMatrix          = utils.MakeWorld( 0.4366,   12.789,    4.1852,      0,     -101,       0,     1);
var dl2LocalMatrix          = utils.MakeWorld( 0.713,    12.789,    4.1852,      0,     -101,       0,     1);
var dl3LocalMatrix          = utils.MakeWorld( 0.9923,   12.789,    4.1852,      0,     -101,       0,     1);
var dl4LocalMatrix          = utils.MakeWorld( 1.3917,   12.789,    4.1852,      0,     -101,       0,     1);
var dl5LocalMatrix          = utils.MakeWorld( 1.6681,   12.789,    4.1852,      0,     -101,       0,     1);
var dl6LocalMatrix          = utils.MakeWorld( 1.9474,   12.789,    4.1852,      0,     -101,       0,     1);
var dr1LocalMatrix          = utils.MakeWorld(-2.8273,   12.789,    4.1852,      0,     -101,       0,     1);
var dr2LocalMatrix          = utils.MakeWorld(-2.5509,   12.789,    4.1852,      0,     -101,       0,     1);
var dr3LocalMatrix          = utils.MakeWorld(-2.2716,   12.789,    4.1852,      0,     -101,       0,     1);
var dr4LocalMatrix          = utils.MakeWorld(-1.8722,   12.789,    4.1852,      0,     -101,       0,     1);
var dr5LocalMatrix          = utils.MakeWorld(-1.5958,   12.789,    4.1852,      0,     -101,       0,     1);
var dr6LocalMatrix          = utils.MakeWorld(-1.316,    12.789,    4.1852,      0,     -101,       0,     1);
var leftButtonLocalMatrix   = utils.MakeWorld( 2.6175,    8.7853,  -6.6902,      0,        0,     -90,     1);  // #17
var leftFlipperLocalMatrix  = utils.MakeWorld( 0.6906,    8.4032,  -5.6357,     29.8,     -3.24,   -5.64,  1);  // #18
var pullerLocalMatrix       = utils.MakeWorld(-2.5264,    8.3925,  -7.5892,      0,      -90,       0,     1);  // #19
var rightButtonLocalMatrix  = utils.MakeWorld(-2.97,      8.7853,  -6.6902,      0,        0,      90,     1);  // #20
var rightFlipperLocalMatrix = utils.MakeWorld(-1.307,     8.4032,  -5.6357,    150,       -3.24,   -5.64,  1);  // #21
var leftSlingshotMatrix     = utils.MakeWorld(1.1,    8.5,   -4.50626,   180,     0,       0,     1);           //
var rightSlingshotMatrix    = utils.MakeWorld(-1.6,    8.5,   -4.50626,   90,     0,       0,     1);           //
var cubeLocalMatrix         = utils.MakeWorld( 1,       9.7,        2.5,           0,       -5.8,       0,     0.5);  // 
var leftCoinLocalMatrix     = utils.MakeWorld( 1,       9,        -2.5,           0,       90,       0,     0.5); 
var rightCoinLocalMatrix    = utils.MakeWorld( -1.4,       9,        -2.5,           0,       90,       0,     0.5); 
var fungo1LocalMatrix       = bumper1LocalMatrix;
var fungo2LocalMatrix       = bumper2LocalMatrix;
var fungo3LocalMatrix       = bumper3LocalMatrix;
var tuboLocalMatrix         = utils.MakeWorld(-0.3,    8.9,   -3.50626,   90,     -5.4,       0,     0.2);
var bonusBallLocalMatrix    = utils.MakeWorld( 0,         0,        0,           0,        0,       0,     1); // #0

var allLocalMatrices = [ballLocalMatrix, bodyLocalMatrix, bumper1LocalMatrix, bumper2LocalMatrix, bumper3LocalMatrix, dl1LocalMatrix, dl2LocalMatrix, dl3LocalMatrix,
                        dl4LocalMatrix, dl5LocalMatrix, dl6LocalMatrix, dr1LocalMatrix, dr2LocalMatrix, dr3LocalMatrix, dr4LocalMatrix, dr5LocalMatrix, dr6LocalMatrix,
                        leftButtonLocalMatrix, leftFlipperLocalMatrix, pullerLocalMatrix, rightButtonLocalMatrix, rightFlipperLocalMatrix, leftSlingshotMatrix, 
                        rightSlingshotMatrix, cubeLocalMatrix, leftCoinLocalMatrix, rightCoinLocalMatrix, fungo1LocalMatrix, fungo2LocalMatrix, fungo3LocalMatrix, tuboLocalMatrix, bonusBallLocalMatrix];


function getBallLocalMatrix(ballX, ballY) {
    return utils.MakeWorld(...fromPlaneToSpace(ballX, ballY), 0, 0, 0, 1);
}

function getBonusBallLocalMatrix(ballX, ballY, active) {
    return utils.MakeWorld(...fromPlaneToSpace(ballX, ballY), 0, 0, 0, active ? 1 : 0);
}

function fromPlaneToSpace(ballX, ballY) {
    let realZ = ballY - Y_OFFSET;

    return [
        X_OFFSET - ballX, 
        BASE_Y + Math.tan(utils.degToRad(PLANE_INCLINATION)) * (realZ - BASE_Z), 
        realZ
    ];
}

function getLeftFlipperLocalMatrix(angle) {
        return utils.MakeWorld(0.6906,      8.4032,     -5.6357,       - angle,      -3.24,      -5.64,      1);
}

function getRightFlipperLocalMatrix(angle) {
    return utils.MakeWorld(-1.307, 8.4032, -5.6357, - angle, -3.24, -5.64, 1);
}

function getPullerLocalMatrix(power) {
    return utils.MakeWorld(-2.5264, 8.3925, -7.1 - power, 0, -90, 0, 1);
}

function getRightCoinLocalMatrix(angle, scale, z) {
    return utils.MakeWorld( -1.4,       z,        -2.5,           0,       90,       utils.radToDeg(angle),     scale); 
}

function getLeftCoinLocalMatrix(angle, scale, z) {
    return utils.MakeWorld( 1,       z,        -2.5,           0,       90,       utils.radToDeg(angle),    scale); 
}