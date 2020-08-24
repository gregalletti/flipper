#version 300 es

precision mediump float;

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

uniform vec3 pLPos;

out vec2 fsUV;
out vec3 fsNormal;
out vec3 fs_pos;

out vec4 provacolorefinale;

uniform mat4 matrix; 
uniform mat4 pLWM; 
uniform mat4 pLVM; 
uniform mat4 viewMatrix; 
uniform mat4 nMatrix;     //matrix to transform normals
uniform mat4 dirMatrix;     //matrix to transform directions

uniform vec3 eyePos;
uniform vec3 specularColor;
uniform float specShine;
uniform vec3 mDiffColor;
uniform vec3 emit;
uniform vec3 lightDirectionA; 
uniform vec3 pLCol;
uniform vec3 lightDirectionB; 
uniform vec3 lightColorB;
uniform vec3 ambientLightCol;
uniform vec3 ambientMat;
uniform sampler2D in_texture;

uniform float pLTagret;
uniform float pLDecay;

void main() {

  fsUV = in_uv;
  fs_pos = mat3(viewMatrix) * inPosition;
  fsNormal = mat3(nMatrix) * inNormal; 

  gl_Position = matrix * vec4(inPosition, 1.0);
}

