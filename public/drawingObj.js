//relevant paths to resources
var program;
var baseDir;
var shaderDir;
var modelsDir;

//camera variables
var cx = 0;
var cy = 13.5;
var cz = - 9.5;
var elev = - 30;
var ang = 180;

var vx = 0;
var vy = 0;
var vz = 0;
var rvx = 0;
var rvy = 0;

window.addEventListener("keydown", keyFunctionDown);
window.addEventListener("keyup", keyFunctionUp);

function keyFunctionDown(e) {
  switch (e.key) {
    case "a":
      vx = CAMERA_COORDS_SPEED;
      break;

    case "d":
      vx = - CAMERA_COORDS_SPEED;
      break;

    case "ArrowUp":
      vy = CAMERA_COORDS_SPEED;
      break;

    case "ArrowDown":
      vy = - CAMERA_COORDS_SPEED;
      break;

    case "w":
      vz = CAMERA_COORDS_SPEED;
      break;

    case "s":
      vz = - CAMERA_COORDS_SPEED;
      break;

    case "q":
      rvx = CAMERA_ANGLE_SPEED;
      break;

    case "e":
      rvx = - CAMERA_ANGLE_SPEED;
      break;

    case "ArrowRight":
      rvy = CAMERA_ANGLE_SPEED;
      break;

    case "ArrowLeft":
      rvy = - CAMERA_ANGLE_SPEED;
      break;

    default:
      break;
  }
}


function keyFunctionUp(e) {
  switch (e.key) {
    case "a":
    case "d":
      vx = 0;
      break;

    case "ArrowDown":
    case "ArrowUp":
      vy = 0;
      break;

    case "s":
    case "w":
      vz = 0;
      break;

    case "q":
    case "e":
      rvx = 0;
      break;

    case "ArrowLeft":
    case "ArrowRight":
      rvy = 0;
      break;

    default:
      break;
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

var line1Mesh;
var line2Mesh;
var line3Mesh;
var line4Mesh;
var line5Mesh;
var line6Mesh;
var line7Mesh;
var line8Mesh;
var line9Mesh;
var rampMesh;
var goombaMesh;

var texture;

//score variables
var firstLoop = true;
var record = "000010";
var score = 0;
var currentScore = 0;
var firstTime = false;
var done = false;

//global variables
var cubeTex = DEFAULT_CUBE_UVS;
var currentCubeTex = DEFAULT_CUBE_UVS;
var shouldChangeCubeTexture = true;
var cubeOutcome = 0;
var lives = 1;
var pulling = false;
var power = 0;
var pLight = new PointLight(new Vec2(0,0),"#000000", "");
var cubeZ = 0;
var showBall = true;
var ballBounce = 0;
var rampActive = false;
var rampMovingUp = false;
var rampMovingDown = false;
var rampY = 0;
var goombaScale = 3;
var goalReached = false;

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
  var specShine = 10.0;
    
  //define emission color for digital score
  var emission = [0.0, 0.0, 0.0];    

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

  var lightDirectionHandleRecord = gl.getUniformLocation(program, 'lightDirectionRecord');
  var lightColorHandleRecord = gl.getUniformLocation(program, 'lightColorRecord');

  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
  var viewMatrixPositionHandle = gl.getUniformLocation(program, 'viewMatrix');
  var dirMatrixPositionHandle = gl.getUniformLocation(program, 'dirMatrix');

  var pointLightPositionHandle2 = gl.getUniformLocation(program, 'pLPos');
  var pointLightPositionHandle = gl.getUniformLocation(program, 'pLWM');
  var pointLightPositionHandle3 = gl.getUniformLocation(program, 'pLVM');
  var pointLightColorHandle = gl.getUniformLocation(program, 'pLCol');
  var pointLightTargetHandle = gl.getUniformLocation(program, 'pLTarget');
  var pointLightDecayHandle = gl.getUniformLocation(program, 'pLDecay');

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  
  var vaos = new Array(allMeshes.length);

  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var image = new Image();
  image.src = baseDir + "textures/SuperMarioPinballTemp8.png";
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

      if(currentCubeTex != cubeTex) {
        let newCubeMesh = cubeMesh;      
        newCubeMesh.textures = currentCubeTex;
        
        cubeTex = currentCubeTex;
        setTimeout(() => {shouldChangeCubeTexture = true; currentCubeTex = DEFAULT_CUBE_UVS;}, 5000);
        
      }
      addMeshToScene(24);    
      
    }  
    
    function changeDigitTexture() {

    if(currentScore > 1000 && !goalReached){
      rampMovingUp = true;
      goalReached = true;
      var goalDate = new Date().getTime() + 32000;
      play(pipeSound);

      var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
      
        // Find the distance between now and the count down date
        var distance = goalDate - now;
      
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);      

        if(!rampActive)
          clearInterval(x);

        // If the count down is finished, write some text
        if (distance <= 0 || !rampActive) {
          clearInterval(x);
          rampMovingDown = true;
          mission.innerHTML = "";
        }
        else
          mission.innerHTML = "MISSION: " + seconds + "s";

      }, 1000);
    }

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
          if(!firstTime){
            play(yahoo);
            yahoo.volume = 1;
          }
          firstTime = true;
          setTimeout(() => {done = true}, 1000);
        }
      }
      score = currentScore;
    }
      
    } 
  
  
  function drawScene() {
    //update lives in HTML div
    livesP.innerHTML = "LIVES: " + lives;

    //update textures (if needed) of cube and score  
    changeCubeTexture();
    changeDigitTexture();

    //run the game logic
    startGame();

    // clear scene
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    
    //move camera and calculate view matrix
    cx += vx;
    cy += vy;
    cz += vz;
    elev += rvx;
    ang += rvy;

    var viewMatrix = utils.MakeView(cx, cy, cz, elev, ang);

    //get all the needed matrices (the ones for animated meshes)
    matricesArray[0]  = getBallMatrix(ball.coords.x, ball.coords.y, ball.speed, showBall, ball.onRamp, rampActive);
    matricesArray[18] = getLeftFlipperMatrix(leftFlipper.angle);
    matricesArray[19] = getPullerMatrix(Math.min(power / 50, 0.6));
    matricesArray[21] = getRightFlipperMatrix(rightFlipper.angle);
    matricesArray[24] = getCubeMatrix(cubeZ); 
    matricesArray[25] = getLeftCoinMatrix(leftCoin.rotationAngle + 90, leftCoin.scale, leftCoin.z);
    matricesArray[26] = getRightCoinMatrix(rightCoin.rotationAngle, rightCoin.scale, rightCoin.z);
    matricesArray[31] = getBonusBallMatrix(ball2.coords.x, ball2.coords.y, ball2.active, ball2.speed);
    matricesArray[32] = getDotMatrix(power, 1); 
    matricesArray[33] = getDotMatrix(power, 2); 
    matricesArray[34] = getDotMatrix(power, 3); 
    matricesArray[35] = getDotMatrix(power, 4); 
    matricesArray[36] = getDotMatrix(power, 5); 
    matricesArray[37] = getDotMatrix(power, 6); 
    matricesArray[38] = getDotMatrix(power, 7); 
    matricesArray[39] = getDotMatrix(power, 8); 
    matricesArray[40] = getDotMatrix(power, 9); 
    matricesArray[41] = getRampMatrix(rampY); 
    matricesArray[42] = getGoombaMatrix(); 


    //---------------------------------------- LIGHTS DEFINITION

    // DIRECTIONAL LIGHTS
    // var dirLightAlpha = utils.degToRad(-60);
    //var dirLightBeta = utils.degToRad(50);

    var dirLightAlphaA = utils.degToRad(document.getElementById("dirLightAlphaA").value);//20
    var dirLightBetaA = utils.degToRad(document.getElementById("dirLightBetaA").value);//32
    
    var dirLightAlphaB = utils.degToRad(document.getElementById("dirLightAlphaB").value);//55
    var dirLightBetaB = utils.degToRad(document.getElementById("dirLightBetaB").value);//95
    
    var dirLightAlphaRecord = utils.degToRad(Math.random()*1000%360);
	  var dirLightBetaRecord = utils.degToRad(Math.random()*1000%360);

    var directionalLightA = [Math.cos(180 - dirLightAlphaA) * Math.cos(dirLightBetaA),
    Math.sin(180 - dirLightAlphaA),
    Math.cos(180 - dirLightAlphaA) * Math.sin(dirLightBetaA)
    ];
    var directionalLightColorA = fromHexToRGBVec(document.getElementById("LAlightColor").value);//#4d4d4d

    var directionalLightB = [-Math.cos(dirLightAlphaB) * Math.cos(dirLightBetaB),
    Math.sin(dirLightAlphaB),
    Math.cos(dirLightAlphaB) * Math.sin(dirLightBetaB)
    ];
    var directionalLightColorB = fromHexToRGBVec(document.getElementById("LBlightColor").value);//5e5e5e

    var directionalLightRecord = [-Math.cos(dirLightAlphaRecord) * Math.cos(dirLightBetaRecord),
    Math.sin(dirLightAlphaRecord),
    Math.cos(dirLightAlphaRecord) * Math.sin(dirLightBetaRecord)
    ];
    var directionalLightColorRecord = [Math.random(), Math.random(), Math.random()];//5e5e5e

    // CAMERA SPACE TRANSFORMATION OF LIGHTS 

    // Directional Lights direction transformation to Camera Space
    var lightDirMatrix = utils.sub3x3from4x4(utils.invertMatrix(utils.transposeMatrix(viewMatrix)));
    var lightDirectionTransformedA = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightA));
    var lightDirectionTransformedB = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightB));
    
    var lightDirectionTransformedRecord = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightRecord));
    
    // POINT LIGHT(s)

    var x = pLight.position.x;
    var y = 9.853;//parseFloat(document.getElementById("y").value/1000);
    var z = pLight.position.y;

    //var x = parseFloat(document.getElementById("x").value/1000);
    //var y = parseFloat(document.getElementById("y").value/1000);
    //var z = parseFloat(document.getElementById("z").value/1000);

    let realCoords = fromPlaneToSpace(x,z);

    x = realCoords[0];
    z = realCoords[2];

    var pointLightPos = [x,y,z,1.0];

    var pointLightColor = fromHexToRGBVec(pLight.color);

    var pointLightPosTransformationMatrix = viewMatrix;
    var pointLightPosTransformed = utils.multiplyMatrixVector(pointLightPosTransformationMatrix,pointLightPos);
    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, matricesArray[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);  

      // matrix to transform normals, used by the Vertex Shader
      var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalTransformationMatrix));
      gl.uniformMatrix3fv(dirMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(pointLightPosTransformationMatrix));
      
      gl.uniformMatrix4fv(viewMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(worldViewMatrix));

      gl.uniform4fv(pointLightPositionHandle2, pointLightPosTransformed);
      gl.uniformMatrix4fv(pointLightPositionHandle3, gl.FALSE, utils.transposeMatrix(viewMatrix));
      gl.uniform3fv(pointLightColorHandle, pointLightColor);
  
      //gl.uniform3fv(eyePositionHandle, eyePositionTransformed);
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
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#ff0000"));
      else if ((pLight.hit == "lSlingshot" && i === 22) || (pLight.hit == "rSlingshot" && i == 23))
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#00ff00"));
      else if ((pLight.hit == "bumper1" && i == 27) || (pLight.hit == "bumper2" && i == 28) || (pLight.hit == "bumper3" && i == 29))
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#ff0000"));
      else if ((pLight.hit == "cube" && i == 24))
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#e1ff00"));
      else if ((pLight.hit == "pipe" && i == 30))
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#00ff00"));
      else
          gl.uniform3fv(emissionColorHandle, fromHexToRGBVec("#000000"));

      if(firstTime && !done){
          gl.uniform3fv(lightColorHandleRecord, directionalLightColorRecord);
          gl.uniform3fv(lightDirectionHandleRecord, lightDirectionTransformedRecord);
      } else{
          gl.uniform3fv(lightColorHandleRecord, fromHexToRGBVec("#000000"));
          gl.uniform3fv(lightDirectionHandleRecord, lightDirectionTransformedRecord);
      }
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
var flipperUp;
var flipperDown;
var coinSound;
var bumperSound;
var pipeSound;
var fallenBallSound;
var magicCubeSound;
var slingshotSound;
var letsGo;
var pullerSound;
var ballRoll;
var ballLoad;
var heart;
var star;
var yahoo;
var bonusSound;
var kick;
var goombaSound;

//custom function to set and play sounds
function play(sound) {
  sound.currentTime = 0;
  sound.play();
  sound.volume = 0.4;
}

//custom function to stop sounds
function stopAudio(sound) {
  sound.currentTime = 0;
  sound.pause();
}


async function init() {
 
  startSound = document.getElementById("new_game");
  gameoverSound = document.getElementById("game_over");
  flipperUp = document.getElementById("flipper_up");
  flipperDown = document.getElementById("flipper_down");
  coinSound = document.getElementById("coin_sound");
  bumperSound = document.getElementById("bumper_sound");
  pipeSound = document.getElementById("pipe_sound");
  fallenBallSound = document.getElementById("fallen_ball");
  ballsCollisionSound = document.getElementById("balls_collision");
  magicCubeSound = document.getElementById("magic_cube");
  slingshotSound = document.getElementById("slingshot");
  letsGo = document.getElementById("lets_go");
  pullerSound = document.getElementById("puller");
  ballRoll = document.getElementById("ballroll");
  heart = document.getElementById("heart");
  star = document.getElementById("star");
  ballLoad = document.getElementById("ball_load");
  yahoo = document.getElementById("yahoo");
  bonusSound = document.getElementById("bonus");
  kick = document.getElementById("kick");
  goombaSound = document.getElementById("goomba");

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
    bonusBallMesh = await utils.loadMesh(modelsDir + "BonusBall.obj");
    bodyMesh = await utils.loadMesh(modelsDir + "BodyFigo2.obj");
    bumper1Mesh = await utils.loadMesh(modelsDir + "bumper1.obj");
    bumper2Mesh = await utils.loadMesh(modelsDir + "bumper1.obj");
    bumper3Mesh = await utils.loadMesh(modelsDir + "bumper1.obj");
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
    cubeMesh = await utils.loadMesh(modelsDir + "NewMagicCube.obj");
    leftCoinMesh = await utils.loadMesh(modelsDir + "coinForseGiusto.obj");
    rightCoinMesh = await utils.loadMesh(modelsDir + "coinForseGiusto.obj");
    fungo1Mesh = await utils.loadMesh(modelsDir + "fungo1.obj");
    fungo2Mesh = await utils.loadMesh(modelsDir + "fungo1.obj");
    fungo3Mesh = await utils.loadMesh(modelsDir + "fungo1.obj");
    tuboMesh = await utils.loadMesh(modelsDir + "tubega.obj");
    line1Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line2Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line3Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line4Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line5Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line6Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line7Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line8Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    line9Mesh = await utils.loadMesh(modelsDir + "dot.obj");
    rampMesh = await utils.loadMesh(modelsDir + "Ramp2.obj");
    goombaMesh = await utils.loadMesh(modelsDir + "Goomba.obj");

    allMeshes = [ballMesh, bodyMesh, bumper1Mesh, bumper2Mesh, bumper3Mesh, dl1Mesh, dl2Mesh, dl3Mesh, dl4Mesh, dl5Mesh, dl6Mesh,
      dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh, leftButtonMesh, leftFlipperMesh, pullerMesh, rightButtonMesh, rightFlipperMesh, 
      slingshotLeftMesh, slingshotRightMesh, cubeMesh, leftCoinMesh, rightCoinMesh, fungo1Mesh, fungo2Mesh, fungo3Mesh, tuboMesh, bonusBallMesh, line1Mesh, line2Mesh, line3Mesh, line4Mesh, line5Mesh, line6Mesh, line7Mesh, line8Mesh, line9Mesh, rampMesh, goombaMesh];
  }
  
} 

window.onload = init;