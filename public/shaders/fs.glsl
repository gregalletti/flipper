#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec4 fs_pos;
in vec3 provapos;
out vec4 outColor;

uniform vec3 eyePos;
uniform vec3 specularColor;
uniform float specShine;
uniform vec3 mDiffColor;
uniform vec3 emit;
uniform vec3 lightDirectionA; 
uniform vec3 lightColorA;
uniform vec3 lightDirectionB; 
uniform vec3 lightColorB;
uniform vec3 ambientLightCol;
uniform vec3 ambientMat;
uniform sampler2D in_texture;

uniform vec4 pLPos;
uniform vec3 pLCol;
uniform mat4 pLWM;
uniform mat4 pLVM;
uniform float pLTagret;
uniform float pLDecay;

void main() {
    
  vec4 texelCol = texture(in_texture, fsUV);
  
  vec3 nNormal = normalize(fsNormal);
  
  vec3 lDirA = normalize(lightDirectionA); 
  vec3 lDirB = normalize(lightDirectionB);
  
  //computing Lambert diffuse color
  vec3 diffA = clamp(dot(-lDirA,nNormal), 0.0, 1.0) * lightColorA;
  vec3 diffB = clamp(dot(-lDirB,nNormal), 0.0, 1.0) * lightColorB;

  vec4 giustaPos = pLPos;
  
  vec3 lDir = vec3(normalize(giustaPos - fs_pos));

	vec3 lCol = pLCol * pow(1.0 / length(giustaPos - fs_pos), 1.0);

  vec3 diffusePoint = lCol * clamp(dot(normalize(fsNormal), lDir),0.0,1.0);

  vec3 lambertColor = clamp((mDiffColor*(diffusePoint + diffA + diffB)), 0.0, 1.0);

  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing Blinn specular color
  vec3 eyeDir = vec3(normalize(-fs_pos));
  vec3 halfVecA = normalize(eyeDir + lDirA);
  vec3 halfVecB = normalize(eyeDir + lDirB);
  vec3 halfVecC = normalize(eyeDir + lDir);
  vec3 specularA = pow(max(dot(halfVecA, nNormal), 0.0), specShine) * lightColorA;
  vec3 specularB = pow(max(dot(halfVecB, nNormal), 0.0), specShine) * lightColorB;
  vec3 specularC = pow(max(dot(halfVecC, nNormal), 0.0), specShine) * lCol;
  vec3 blinnSpecular = specularColor * (specularA + specularB + specularC);
  
  //computing BRDF color
  vec4 color = vec4(clamp(blinnSpecular + lambertColor + ambient + emit, 0.0, 1.0).rgb,1.0);
  
  //compose final color with texture
  vec4 outColorfs = color * texture(in_texture, fsUV);
  outColor = outColorfs;
}