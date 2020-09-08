#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec4 fs_pos;

uniform vec3 specularColor;
uniform float specShine;
uniform vec3 mDiffColor;
uniform vec3 emit;

//directional light A
uniform vec3 lightDirectionA; 
uniform vec3 lightColorA;

//directional light B
uniform vec3 lightDirectionB; 
uniform vec3 lightColorB;

//directional light "Record"
uniform vec3 lightDirectionRecord; 
uniform vec3 lightColorRecord;

//ambient
uniform vec3 ambientLightCol;
uniform vec3 ambientMat;

//texture
uniform sampler2D in_texture;

//point light
uniform vec4 pLPos;
uniform vec3 pLCol;

out vec4 outColor;

//computes the lambert diffuse
vec3 lambertDiffuse(vec3 lightDir, vec3 lightCol, vec3 normalVec) {
  vec3 diffL = lightCol * clamp(dot(normalVec, lightDir),0.0,1.0);
  return diffL;
}

//computes the blinn specular
vec3 blinnSpecular(vec3 lightDir, vec3 lightCol, vec3 normalVec, vec4 fs_pos, float specShine) {
  // camera space implies eye position to be (0,0,0)
  vec3 eyeDir = vec3(normalize(-fs_pos));
  vec3 halfVec = normalize(eyeDir + lightDir);
  vec3 specularBl = pow(max(dot(halfVec, normalVec), 0.0), specShine) * lightCol;

  return specularBl;
}

//computes the color of a point light with decay
vec3 pointLightColor(vec4 pLPos, vec3 pLCol, vec4 fs_pos, float target, float decay) {
	vec3 lCol = pLCol * pow(target / length(pLPos - fs_pos), decay);

  return lCol;
}

void main() {
  
  //normalize fsNormal, it might not be in the normalized form coming from the vs
  vec3 nNormal = normalize(fsNormal);
  
  //light directions
  vec3 lDirA = normalize(lightDirectionA); 
  vec3 lDirB = normalize(lightDirectionB);
  vec3 lDirRecord = normalize(lightDirectionRecord);
  vec3 lDirP = vec3(normalize(pLPos-fs_pos));

  //computing Lambert diffuse color
  //directional lights
  vec3 diffA = lambertDiffuse(lDirA,lightColorA,nNormal);
  vec3 diffB = lambertDiffuse(lDirB,lightColorB,nNormal);
  vec3 diffRecord = lambertDiffuse(lDirRecord,lightColorRecord,nNormal);
  //point lights
	vec3 lCol = pointLightColor(pLPos, pLCol, fs_pos, 0.5, 1.0);
  vec3 diffusePointContact = lambertDiffuse(lDirP,lCol,nNormal);

  //total lambert component
  vec3 lambertDiff = clamp((mDiffColor*(diffusePointContact + diffA + diffB + diffRecord)), 0.0, 1.0);

  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing Blinn specular color
  vec3 specA = blinnSpecular(lDirA,lightColorA,nNormal,fs_pos,specShine);
  vec3 specB = blinnSpecular(lDirB,lightColorB,nNormal,fs_pos,specShine);
  vec3 specRecord = blinnSpecular(lDirRecord,lightColorRecord,nNormal,fs_pos,specShine);
  vec3 specP = blinnSpecular(lDirP,lCol,nNormal,fs_pos,specShine);

  //total specular component
  vec3 blinnSpec = specularColor * (specA + specB + specP + specRecord);
  
  //computing BRDF color
  vec4 color = vec4(clamp(blinnSpec + lambertDiff + ambient + emit, 0.0, 1.0).rgb,1.0);
  
  //compose final color with texture
  vec4 outColorfs = color * texture(in_texture, fsUV);
  outColor = outColorfs;
}