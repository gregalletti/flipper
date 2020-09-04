/* 
    MakeWorld: function (tx, ty, tz, rx, ry, rz, s)

    t: traslazione
    r: rotazione
    s: scaling
*/

var ballMatrix              = utils.MakeWorld(0         , 0         ,        0,           0,        0,       0,     1);
var bodyMatrix              = utils.MakeWorld(0         , 8.5       ,        0,           0,        0,       0,     1);
var bumper1Matrix           = utils.MakeWorld(1.1819    , 9.1362    ,   0.020626,   0,     0,       0,     1);
var bumper2Matrix           = utils.MakeWorld(- 1.5055  , 9.1362    ,   0.020626,   30,     0,       0,     1);
var bumper3Matrix           = utils.MakeWorld(- 0.11626 , 9.0362    ,   -1.020626,  60,     0,       0,     1);
var dl1Matrix               = utils.MakeWorld(0.4366    , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dl2Matrix               = utils.MakeWorld(0.713     , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dl3Matrix               = utils.MakeWorld(0.9923    , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dl4Matrix               = utils.MakeWorld(1.3917    , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dl5Matrix               = utils.MakeWorld(1.6681    , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dl6Matrix               = utils.MakeWorld(1.9474    , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr1Matrix               = utils.MakeWorld(- 2.8273  , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr2Matrix               = utils.MakeWorld(- 2.5509  , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr3Matrix               = utils.MakeWorld(- 2.2716  , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr4Matrix               = utils.MakeWorld(- 1.8722  , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr5Matrix               = utils.MakeWorld(- 1.5958  , 12.789    ,    4.1852,      0,     -102,       0,     1);
var dr6Matrix               = utils.MakeWorld(- 1.316   , 12.789    ,    4.1852,      0,     -102,       0,     1);
var leftButtonMatrix        = utils.MakeWorld(2.6175    , 8.7853    ,  -6.6902,      0,        0,     -90,     1);  
var leftFlipperMatrix       = utils.MakeWorld(0.6906    , 8.4032    ,  -5.6357,     29.8,     -3.24,   -5.64,  1);  
var pullerMatrix            = utils.MakeWorld(- 2.5264  , 8.3925    ,  -7.5892,      0,      -90,       0,     1); 
var rightButtonMatrix       = utils.MakeWorld(- 2.97    , 8.7853    ,  -6.6902,      0,        0,      90,     1);  
var rightFlipperMatrix      = utils.MakeWorld(- 1.307   , 8.4032    ,  -5.6357,    150,      0,   0,  1);  
var leftSlingshotMatrix     = utils.MakeWorld(1.1       , 8.5       ,       -4.50626,   180,     -5.4,      0,     1);           
var rightSlingshotMatrix    = utils.MakeWorld(- 1.6     , 8.5       ,   -4.50626,   90,     0,       -5.4,     1);           
var cubeMatrix              = utils.MakeWorld(1         , 9.8       ,        2.5,           0,       -5.8,       0,     0.5);  
var leftCoinMatrix          = utils.MakeWorld(1         , 9         ,        -2.5,           0,       90,       0,     0.5); 
var rightCoinMatrix         = utils.MakeWorld(- 1.4     , 9         ,        -2.5,           0,       90,       0,     0.5); 
var tuboMatrix              = utils.MakeWorld(- 0.3     , 8.9       ,   -3.50626,   90,     -5.4,       0,     0.2);
var bonusBallMatrix         = utils.MakeWorld(0         , 0         ,        0,           0,        0,       0,     1); 
var rampMatrix              = utils.MakeWorld(-2     , 9.7       ,   3.8,  -90,     -5.4,       0,     1);

var fungo1Matrix            = bumper1Matrix;
var fungo2Matrix            = bumper2Matrix;
var fungo3Matrix            = bumper3Matrix;

var line1Matrix             = utils.MakeWorld(0         , 0         ,        0,           0,        0,       0,     0); 
var line2Matrix             = line1Matrix;
var line3Matrix             = line1Matrix;
var line4Matrix             = line1Matrix;
var line5Matrix             = line1Matrix;
var line6Matrix             = line1Matrix;
var line7Matrix             = line1Matrix;
var line8Matrix             = line1Matrix;
var line9Matrix             = line1Matrix;

var goombaMatrix            = utils.MakeWorld(- 2  , 10.7    ,    4,      0,     -90,       0,     1);


var matricesArray = [       //all -1
    ballMatrix,             //1
    bodyMatrix,             //2
    bumper1Matrix,          //3
    bumper2Matrix,          //4
    bumper3Matrix,          //5
    dl1Matrix,              //6
    dl2Matrix,              //7
    dl3Matrix,              //8
    dl4Matrix,              //9
    dl5Matrix,              //10
    dl6Matrix,              //11
    dr1Matrix,              //12
    dr2Matrix,              //13
    dr3Matrix,              //14
    dr4Matrix,              //15
    dr5Matrix,              //16
    dr6Matrix,              //17
    leftButtonMatrix,       //18
    leftFlipperMatrix,      //19
    pullerMatrix,           //20
    rightButtonMatrix,      //21
    rightFlipperMatrix,     //22
    leftSlingshotMatrix,    //23
    rightSlingshotMatrix,   //24
    cubeMatrix,             //25
    leftCoinMatrix,         //26  
    rightCoinMatrix,        //27 
    fungo1Matrix,           //28
    fungo2Matrix,           //29
    fungo3Matrix,           //30
    tuboMatrix,             //31  
    bonusBallMatrix,        //32 
    line1Matrix,            //33        
    line2Matrix,            //34        
    line3Matrix,            //35       
    line4Matrix,            //36        
    line5Matrix,            //37    
    line6Matrix,            //38    
    line7Matrix,            //39        
    line8Matrix,            //40    
    line9Matrix,            //41           
    rampMatrix,             //42
    goombaMatrix            //43
];

var angleY1 = 0;
var angleZ1 = 0;
var angleY2 = 0;
var angleZ2 = 0;

function getGoombaMatrix(){
    return utils.MakeWorld(- 1.98  , 10.5    ,    4.02,      0,     -94,       0,     3 - goombaScale);
}

function getRampMatrix(rampY){
    //y = 9.7 is the right value when visible
    //rampY goes from 0 to 1, then again from 1 to 0
    return utils.MakeWorld(-2     , 8.7 + rampY       ,   3.8,  -90,     -5.4,       0,     1);
}

function getDotMatrix(power, number) {

    if(power > number * 1.6){
        let spaceCoords = fromPlaneToSpace(4.6 - (0.1 * number) * (0.1 * number) , 2 + number);

        return utils.MakeWorld(spaceCoords[0], spaceCoords[1] - 0.2, spaceCoords[2], 0, -5.4, 0, 0.4);
    }
    return utils.MakeWorld(0       ,    0,0,0,0,0,0);
}


function getBallMatrix(ballX, ballY, speed, active, onRamp, rampActive) {

    angleY1 += (speed.y / BALL_RADIUS);
    angleZ1 += (speed.x / BALL_RADIUS);
    
    let spaceCoords = fromPlaneToSpace(ballX, ballY);

    let moreY = 0;
    if(onRamp && rampActive)
        moreY += Math.tan(utils.degToRad(RAMP_INCLINATION)) * (ballY - RAMP_START_Y);
    else
        moreY = 0; 

    return utils.MakeWorld(spaceCoords[0], spaceCoords[1] + ballBounce + moreY, spaceCoords[2], 0, angleY1 / 2, angleZ1 / 2, active ? 1 : 0);
    
}

function getBonusBallMatrix(ballX, ballY, active, speed, onRamp, rampActive) {

    angleY2 += (speed.y / BALL_RADIUS);
    angleZ2 += (speed.x / BALL_RADIUS);

    let spaceCoords = fromPlaneToSpace(ballX, ballY);

    let moreY = 0;
    if(onRamp && rampActive)
        moreY += Math.tan(utils.degToRad(RAMP_INCLINATION)) * (ballY - RAMP_START_Y);
    else
        moreY = 0; 

    return utils.MakeWorld(spaceCoords[0], spaceCoords[1] + ballBounce + moreY, spaceCoords[2], 0, angleY2 / 2, angleZ2 / 2, active ? 1 : 0);
}

function fromPlaneToSpace(ballX, ballY) {
    let realZ = ballY - Y_OFFSET;

    return [
        X_OFFSET - ballX, 
        BASE_Y + Math.tan(utils.degToRad(PLANE_INCLINATION)) * (realZ - BASE_Z), 
        realZ
    ];
}

function getLeftFlipperMatrix(angle) {
        return utils.MakeWorld(0.6906,      8.4032,     -5.6357,       - angle,      0,      -5.4,      1);
}

function getRightFlipperMatrix(angle) {
    return utils.MakeWorld(-1.307, 8.4032, -5.6357, - angle, -5.4, 0, 1);
}

function getPullerMatrix(power) {
    return utils.MakeWorld(-2.5264, 8.3925, -7.1 - Math.min(power, 0.3), 0, -90, 0, 1);
}

function getRightCoinMatrix(angle, scale, z) {
    return utils.MakeWorld( -1.4,       z,        -2.5,           0,       90,       utils.radToDeg(angle),     scale); 
}

function getLeftCoinMatrix(angle, scale, z) {
    return utils.MakeWorld( 1,       z,        -2.5,           0,       90,       utils.radToDeg(angle),    scale); 
}

function getCubeMatrix(z) {

    return utils.MakeWorld( 1,       9.8 + 0.1 + Math.sin(z)/10,        2.5,           0,       -5.8,       0,     0.5);
    
}