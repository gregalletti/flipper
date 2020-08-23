// PATHS
var program;
var baseDir;
var shaderDir;
var modelsDir;

// CAMERA STATUS AND CONTROLS:
var viewX = 0;
var viewY = 13.5;
var viewZ = - 9.5;
var viewPhi = - 30;
var viewTheta = 180;

var viewXSpeed = 0;
var viewYSpeed = 0;
var viewZSpeed = 0;
var viewPhiSpeed = 0;
var viewThetaSpeed = 0;

const positionSpeed = 1;
const angleSpeed = 10;
const camera_dt = 1 / 30;

const viewXIncreaseKey = "ArrowLeft";   // move left
const viewXDecreaseKey = "ArrowRight";  // move right
const viewYIncreaseKey = "s";           // move down
const viewYDecreaseKey = "w";           // move up
const viewZIncreaseKey = "ArrowUp";     // move forward
const viewZDecreaseKey = "ArrowDown";   // move backward
const viewPhiIncreaseKey = "r";         // tilt up
const viewPhiDecreaseKey = "f";         // tilt down
const viewThetaIncreaseKey = "q";       // pan left
const viewThetaDecreaseKey = "e";       // pan right

window.addEventListener("keydown", handlePress);
window.addEventListener("keyup", handleRelease);

function handlePress(event) {
  switch (event.key) {
    case viewXIncreaseKey:
      return viewXSpeed = positionSpeed;
    case viewXDecreaseKey:
      return viewXSpeed = -positionSpeed;
    case viewYIncreaseKey:
      return viewYSpeed = positionSpeed;
    case viewYDecreaseKey:
      return viewYSpeed = -positionSpeed;
    case viewZIncreaseKey:
      return viewZSpeed = positionSpeed;
    case viewZDecreaseKey:
      return viewZSpeed = -positionSpeed;
    case viewPhiIncreaseKey:
      return viewPhiSpeed = angleSpeed;
    case viewPhiDecreaseKey:
      return viewPhiSpeed = -angleSpeed;
    case viewThetaIncreaseKey:
      return viewThetaSpeed = angleSpeed;
    case viewThetaDecreaseKey:
      return viewThetaSpeed = -angleSpeed;
    default:
      return 0;
  }
}

function handleRelease(event) {
  switch (event.key) {
    case viewXIncreaseKey:
    case viewXDecreaseKey:
      return viewXSpeed = 0;
    case viewYIncreaseKey:
    case viewYDecreaseKey:
      return viewYSpeed = 0;
    case viewZIncreaseKey:
    case viewZDecreaseKey:
      return viewZSpeed = 0;
    case viewPhiIncreaseKey:
    case viewPhiDecreaseKey:
      return viewPhiSpeed = 0;
    case viewThetaIncreaseKey:
    case viewThetaDecreaseKey:
      return viewThetaSpeed = 0;
    default:
      return 0;
  }
}

// MESHES
var ballMesh;
var bonusBallMesh;
var bodyMesh;
var bumper1Mesh;
var bumper2Mesh;
var bumper3Mesh;
var dl1Mesh;
var dl2Mesh;
var dl3Mesh;
var dl4Mesh;
var dl5Mesh;
var dl6Mesh;
var dr1Mesh;
var dr2Mesh;
var dr3Mesh;
var dr4Mesh;
var dr5Mesh;
var dr6Mesh;
var leftButtonMesh;
var leftFlipperUpMesh;
var leftFlipperDownMesh;
var pullerMesh;
var rightButtonMesh;
var rightFlipperMesh;
var slingshotLeftMesh;
var slingshotRightMesh;
var obstacleLeftMesh;
var obstacleRightMesh;
var poleLeftMesh;
var poleCenterMesh;
var poleRightMesh;
var bigSphereMesh;
var tunnelRightMesh;
var tunnelLeftMesh;
var tunnelUpMesh;
var cubeMesh;
var leftCoinMesh;
var rightCoinMesh;
var objects;

var fungo1Mesh;
var fungo2Mesh;
var fungo3Mesh;

var tuboMesh;

var texture;

//score variables
var firstLoop = true;
var record = "002010";
var score = 0;
var currentScore = 0;

//global variables
var cubeOutcome = 0;
var lives = 3;
var pulling = false;
var power = 0;

function fromHexToRGBVec(hex) {
  col = hex.substring(1,7);
    R = parseInt(col.substring(0,2) ,16) / 255;
    G = parseInt(col.substring(2,4) ,16) / 255;
    B = parseInt(col.substring(4,6) ,16) / 255;
  return [R,G,B]
}
              

function main() {
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); 

  // define material color 
  var materialColor = [1.0, 1.0, 1.0];

  // define ambient light color and material
  var ambientLight = [0.15, 0.9, 0.8];
  var ambientMat = [0.4, 0.2, 0.6];
    
  //define specular component of color
  var specularColor = [1.0, 1.0, 1.0];
  var specShine = 2.0;
    
  //define emission color for digital score
  var emission = [1.0, 0.0, 0.0];    

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  var textLocation = gl.getUniformLocation(program, "in_texture");
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var eyePositionHandle = gl.getUniformLocation(program, "eyePos");    
  var ambientLightColorHandle = gl.getUniformLocation(program, "ambientLightCol");
  var ambientMaterialHandle = gl.getUniformLocation(program, "ambientMat");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var specularColorHandle = gl.getUniformLocation(program, "specularColor");
  var shineSpecularHandle = gl.getUniformLocation(program, "specShine");
  var emissionColorHandle = gl.getUniformLocation(program, "emit");    
  var lightDirectionHandleA = gl.getUniformLocation(program, 'lightDirectionA');
  var lightColorHandleA = gl.getUniformLocation(program, 'lightColorA');
  var lightDirectionHandleB = gl.getUniformLocation(program, 'lightDirectionB');
  var lightColorHandleB = gl.getUniformLocation(program, 'lightColorB');

  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

  var pointLightPositionHandle = gl.getUniformLocation(program, 'pLPos');
  var pointLightColorHandle = gl.getUniformLocation(program, 'pLCol');
  var pointLightTargetHandle = gl.getUniformLocation(program, 'pLTarget');
  var pointLightDecayHandle = gl.getUniformLocation(program, 'pLDecay');

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  var vaos = new Array(allMeshes.length);

  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var image = new Image();
  image.src = baseDir + "textures/SuperMarioPinballTemp4.png";
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  };

  function addMeshToScene(i) {
    let mesh = allMeshes[i];
    let vao = gl.createVertexArray();
    vaos[i] = vao;
    gl.bindVertexArray(vao);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
  }

  for (let i in allMeshes)
    addMeshToScene(i);
    
    function changeCubeTexture() {

      let newCubeMesh = cubeMesh;
      
      if(cubeOutcome == 1)
        newCubeMesh.textures = HEART_CUBE_UVS;

      if(cubeOutcome == 2)
        newCubeMesh.textures = STAR_CUBE_UVS;
      
       //newCubeMesh.textures = DEFAULT_CUBE_UVS;

      addMeshToScene(24);    
      
    }  
    
    function changeDigitTexture() {

    let rightDigitMeshesArray = [dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh];
    let leftDigitMeshesArray = [dl1Mesh, dl2Mesh, dl3Mesh, dl4Mesh, dl5Mesh, dl6Mesh];

    if(firstLoop)  {

      let recordArray = Array.from(String(record), Number).reverse();
      
        for (let i = 0; i < recordArray.length; i++) {
          leftDigitMeshesArray[i].textures = DIGIT_UVS[recordArray[i]];
          addMeshToScene(i + 5);
        }

        for (let i = 0; i < 6; i++) {
          rightDigitMeshesArray[i].textures = DIGIT_UVS[0];
          addMeshToScene(i + 11);
        }

        firstLoop = false;
    }

    if(currentScore > score)  {

      let currentScoreArray = Array.from(String(currentScore), Number).reverse();
      for (let i = 0; i < currentScoreArray.length; i++) {
        rightDigitMeshesArray[i].textures = DIGIT_UVS[currentScoreArray[i]];
        addMeshToScene(i + 11);
      }
      if(currentScore > record)  {
        for (let i = 0; i < currentScoreArray.length; i++) {
          leftDigitMeshesArray[i].textures = DIGIT_UVS[currentScoreArray[i]];
          addMeshToScene(i + 5);
        }
      }
      score = currentScore;
    }
      
    } 
  
  function drawScene() {

    // update uv coordinates of dynamic score system  
    changeCubeTexture();
    changeDigitTexture();

    // adjust camera
    viewX += viewXSpeed * camera_dt;
    viewY += viewYSpeed * camera_dt;
    viewZ += viewZSpeed * camera_dt;
    viewPhi += viewPhiSpeed * camera_dt;
    viewTheta += viewThetaSpeed * camera_dt;

    controller();

    // clear scene
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // compose view and light
    var viewMatrix = utils.MakeView(viewX, viewY, viewZ, viewPhi, viewTheta);

    // update world matrices for moving objects
    allLocalMatrices[0] = getBallLocalMatrix(ball.coords.x, ball.coords.y, ball.speed);
    allLocalMatrices[18] = getLeftFlipperLocalMatrix(leftFlipper.angle);
    allLocalMatrices[19] = getPullerLocalMatrix(Math.min(power / 50, 0.6));
    allLocalMatrices[21] = getRightFlipperLocalMatrix(rightFlipper.angle);
    allLocalMatrices[26] = getRightCoinLocalMatrix(rightCoin.rotationAngle, rightCoin.scale, rightCoin.z);
    allLocalMatrices[25] = getLeftCoinLocalMatrix(leftCoin.rotationAngle + 90, leftCoin.scale, leftCoin.z);
    allLocalMatrices[31] = getBonusBallLocalMatrix(ball2.coords.x, ball2.coords.y, ball2.active, ball2.speed); 

    // ---------------------------------------- LIGHTS DEFINITION

    // DIRECTIONAL LIGHTS
    // var dirLightAlpha = utils.degToRad(-60);
    //var dirLightBeta = utils.degToRad(50);

    var dirLightAlpha = utils.degToRad(document.getElementById("LCDirTheta").value);

	  var dirLightBeta = utils.degToRad(document.getElementById("LCDirPhi").value);

    var directionalLightA = [Math.cos(180 - dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(180 - dirLightAlpha),
    Math.cos(180 - dirLightAlpha) * Math.sin(dirLightBeta)
    ];
    //var directionalLightColorA = [0.55, 0.55, 0.35];
    var directionalLightColorA = fromHexToRGBVec(document.getElementById("LAlightColor").value);

    var directionalLightB = [-Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
    ];
    //var directionalLightColorB = [0.45, 0.35, 0.15];
    //var directionalLightColorB = fromHexToRGBVec(document.getElementById("LBlightColor").value);
    var directionalLightColorB = fromHexToRGBVec("#ffffff");

    // CAMERA SPACE TRANSFORMATION OF LIGHTS 

    // Directional Lights direction transformation to Camera Space
    var lightDirMatrix = utils.sub3x3from4x4(utils.invertMatrix(utils.transposeMatrix(viewMatrix)));
    var lightDirectionTransformedA = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightA));
    var lightDirectionTransformedB = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightB));
    
    // POINT LIGHT(s)

    var pointLightPos = [ parseFloat(document.getElementById("x").value/1000),
                          parseFloat(document.getElementById("y").value/1000),
                          parseFloat(document.getElementById("z").value/1000)];

    //allLocalMatrices[0] = utils.MakeWorld(pointLightPos[0],pointLightPos[1],pointLightPos[2],0,0,0,1)

    //pointLightPos = [0,0,10]
    var pointLightColor = fromHexToRGBVec(document.getElementById("LBlightColor").value);
    //pointLightColor = fromHexToRGBVec("#ffffff");
    var pointLightTarget = parseFloat(document.getElementById("Target").value/1000);
    //var pointLightTarget = parseFloat(10.0);
    var pointLightDecay = parseInt(document.getElementById("Decay").value);
    if(pointLightDecay === 0){
      pointLightDecay = 0.0;
    }

    var pointLightPosTransformed = utils.normalizeVec3(utils.multiplyMatrix3Vector3(viewMatrix, pointLightPos));
    //console.log(pointLigthPosTransformed)
    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, allLocalMatrices[i]); //Camera Space  VIEW = CAMERA^-1
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

      //le trasformazioni seguenti non sono in camera space perché fanno questa cosa per tutte le meshes, 
      //per essere in camera space questa cosa va fatta solo una volta di fuori da questo ciclo (per tutte le luci)
      //var lightDirMatrix = utils.sub3x3from4x4(utils.transposeMatrix(allLocalMatrices[i]));
      //var lightDirectionTransformedA = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightA));
      //var lightDirectionTransformedB = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightB));

      // eye position per adesso non è usata per niente ma poi andrà spostata fuori ho idea
      var eyePositionMatrix = utils.invertMatrix(allLocalMatrices[i]);
      var eyePositionTransformed = utils.normalizeVec3(utils.multiplyMatrix3Vector3(eyePositionMatrix, [viewX, viewY, viewZ]));    

      // matrix to transform normals, used by the Vertex Shader
      var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalTransformationMatrix));

      gl.uniform3fv(pointLightPositionHandle, pointLightPosTransformed);
      gl.uniform3fv(pointLightColorHandle, pointLightColor);
      gl.uniform1f(pointLightTargetHandle, pointLightTarget);
      gl.uniform1f(pointLightDecayHandle, pointLightDecay);

      gl.uniform3fv(eyePositionHandle, eyePositionTransformed);
      gl.uniform3fv(materialDiffColorHandle, materialColor);
      gl.uniform3fv(lightColorHandleA, directionalLightColorA);
      gl.uniform3fv(lightDirectionHandleA, lightDirectionTransformedA);
      gl.uniform3fv(lightColorHandleB, directionalLightColorB);
      gl.uniform3fv(lightDirectionHandleB, lightDirectionTransformedB);
      gl.uniform3fv(ambientLightColorHandle, ambientLight);
      gl.uniform3fv(ambientMaterialHandle, ambientMat);
      gl.uniform3fv(specularColorHandle, specularColor);
      gl.uniform1f(shineSpecularHandle, specShine);
        
      if (i >= 5 && i <=16)   
          gl.uniform3fv(emissionColorHandle, emission);
      else
          gl.uniform3fv(emissionColorHandle, [0.0, 0.0, 0.0]);
          
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textLocation, 0);

      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    window.requestAnimationFrame(drawScene);
  }
  
  drawScene();
}

var startSound;
var gameoverSound;
var flipperSound;
var flipperDown;
var coinSound;
var bumperSound;
var pipeSound;
var fallenBallSound;
var magicCubeSound;
var slingshotSound;
var letsGo;

/**
 * 
 * @param {HTMLAudioElement} sound 
 */
function play(sound) {
  sound.currentTime = 0;
  sound.play();
}

async function init() {
 
  startSound = document.getElementById("new_game");
  gameoverSound = document.getElementById("game_over");
  flipperSound = document.getElementById("flipper_sound");
  flipperDown = document.getElementById("flipper_down");
  coinSound = document.getElementById("coin_sound");
  bumperSound = document.getElementById("bumper_sound");
  pipeSound = document.getElementById("pipe_sound");
  fallenBallSound = document.getElementById("fallen_ball");
  ballsCollisionSound = document.getElementById("balls_collision");
  magicCubeSound = document.getElementById("magic_cube");
  slingshotSound = document.getElementById("slingshot");
  letsGo = document.getElementById("lets_go");

  setupCanvas();
  loadShaders();
  await loadMeshes();
  main();

  // prepare canvas and body styles
  function setupCanvas() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl2");

    if (!gl) {
      document.write("GL context not opened");
      return;
    }
    utils.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  //load shaders
  async function loadShaders() {
    // initialize resource paths
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir + "shaders/";
    modelsDir = baseDir + "models/"

    // load vertex and fragment shaders from file
    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    gl.useProgram(program);
  }

  // load meshes from obj files
  async function loadMeshes() {
    ballMesh = await utils.loadMesh(modelsDir + "Ball.obj");
    bonusBallMesh = await utils.loadMesh(modelsDir + "Ball.obj");
    bodyMesh = await utils.loadMesh(modelsDir + "Body2.obj");
    bumper1Mesh = await utils.loadMesh(modelsDir + "Bumper1.obj");
    bumper2Mesh = await utils.loadMesh(modelsDir + "Bumper1.obj");
    bumper3Mesh = await utils.loadMesh(modelsDir + "Bumper1.obj");
    dl1Mesh = await utils.loadMesh(modelsDir + "DL1.obj");
    dl2Mesh = await utils.loadMesh(modelsDir + "DL2.obj");
    dl3Mesh = await utils.loadMesh(modelsDir + "DL3.obj");
    dl4Mesh = await utils.loadMesh(modelsDir + "DL4.obj");
    dl5Mesh = await utils.loadMesh(modelsDir + "DL5.obj");
    dl6Mesh = await utils.loadMesh(modelsDir + "DL6.obj");
    dr1Mesh = await utils.loadMesh(modelsDir + "DR1.obj");
    dr2Mesh = await utils.loadMesh(modelsDir + "DR2.obj");
    dr3Mesh = await utils.loadMesh(modelsDir + "DR3.obj");
    dr4Mesh = await utils.loadMesh(modelsDir + "DR4.obj");
    dr5Mesh = await utils.loadMesh(modelsDir + "DR5.obj");
    dr6Mesh = await utils.loadMesh(modelsDir + "DR6.obj");
    leftButtonMesh = await utils.loadMesh(modelsDir + "LeftButton.obj");
    leftFlipperMesh = await utils.loadMesh(modelsDir + "LeftFlipper.obj");
    pullerMesh = await utils.loadMesh(modelsDir + "Puller.obj");
    rightButtonMesh = await utils.loadMesh(modelsDir + "RightButton.obj");
    rightFlipperMesh = await utils.loadMesh(modelsDir + "RightFlipper.obj");
    slingshotLeftMesh = await utils.loadMesh(modelsDir + "LeftSlingshot.obj");
    slingshotRightMesh = await utils.loadMesh(modelsDir + "LeftSlingshot.obj");
    cubeMesh = await utils.loadMesh(modelsDir + "kuboVero.obj")
    leftCoinMesh = await utils.loadMesh(modelsDir + "coinForseGiusto.obj");
    rightCoinMesh = await utils.loadMesh(modelsDir + "coinForseGiusto.obj");
    fungo1Mesh = await utils.loadMesh(modelsDir + "fungo1.obj");
    fungo2Mesh = await utils.loadMesh(modelsDir + "fungo2.obj");
    fungo3Mesh = await utils.loadMesh(modelsDir + "fungo3.obj");
    tuboMesh = await utils.loadMesh(modelsDir + "tubega.obj");


    allMeshes = [ballMesh, bodyMesh, bumper1Mesh, bumper2Mesh, bumper3Mesh, dl1Mesh, dl2Mesh, dl3Mesh, dl4Mesh, dl5Mesh, dl6Mesh,
      dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh, leftButtonMesh, leftFlipperMesh, pullerMesh, rightButtonMesh, rightFlipperMesh, 
      slingshotLeftMesh, slingshotRightMesh, cubeMesh, leftCoinMesh, rightCoinMesh, fungo1Mesh, fungo2Mesh, fungo3Mesh, tuboMesh, bonusBallMesh];
  }
  
} 

function updateBallCounter(balls, gameOver) {
  ballCounter.innerHTML = "Balls " + balls;

  if (gameOver) {
    gameOverBg.style.opacity = 0.5;
    gameOverMsg.style.opacity = 1.0;
  }
}

window.onload = init;