#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec3 fs_pos;
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

uniform vec3 pLPos;
uniform vec3 pLCol;
uniform mat4 pLWM;
uniform mat4 pLVM;
uniform float pLTagret;
uniform float pLDecay;

//in vec4 provacolorefinale;

vec3 compDiffuse(vec3 lightDir, vec3 lightCol, vec3 normalVec) {
	// Diffuse
	// --> Lambert
	vec3 diffuseLambert = lightCol * clamp(dot(normalVec, lightDir),0.0,1.0);
	// ----> Select final component
	return diffuseLambert;
}

void main() {
    
  vec4 texelCol = texture(in_texture, fsUV);
  
  vec3 nNormal = normalize(fsNormal);
  
  vec3 lDirA = normalize(lightDirectionA); 
  vec3 lDirB = normalize(lightDirectionB);
  
  //computing Lambert diffuse color
  vec3 diffA = clamp(dot(-lDirA,nNormal), 0.0, 1.0) * lightColorA;
  vec3 diffB = clamp(dot(-lDirB,nNormal), 0.0, 1.0) * lightColorB;

  vec3 giustaPos = pLPos;

  vec3 lDir = normalize(giustaPos - fs_pos);

	vec3 lCol = pLCol * pow(2.0 / length(giustaPos - fs_pos), 1.0);

  vec3 diffuse = lCol * clamp(dot(normalize(fsNormal), lDir),0.0,1.0);

  vec4 provacolorefinale = vec4(clamp((mDiffColor * diffuse), 0.0, 1.0),1.0);

  //spot
  
  /*float LAConeOut = 60.0;
  float LAConeIn = 45.0;
  float LCosOut = cos(radians(LAConeOut / 2.0));
	float LCosIn = cos(radians(LAConeOut * LAConeIn / 2.0));
	//lightDirA = normalize(LAPos - fsposnorm);
	float CosAngle = dot(lDir, lDirA);
	lCol = pLCol * pow(2.0 / length(pLPos - fsposnorm), 1.0) * clamp((CosAngle - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);*/
  
  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing Blinn specular color
  /*vec3 eyeDir = normalize(eyePos - fsposnorm);
  vec3 halfVecA = normalize(eyeDir + lDirA);
  vec3 halfVecB = normalize(eyeDir + lDirB);
  vec3 halfVecC = normalize(eyeDir + lDir);
  vec3 specularA = pow(max(dot(halfVecA, nNormal), 0.0), specShine) * lightColorA;
  vec3 specularB = pow(max(dot(halfVecB, nNormal), 0.0), specShine) * lightColorB;
  vec3 specularC = pow(max(dot(halfVecC, nNormal), 0.0), specShine) * pLCol;
  vec3 blinnSpecular = specularColor * (specularA + specularB + specularC); */
  
  //computing BRDF color
  //vec3 color = clamp(blinnSpecular + lambertColor + ambient + emit, 0.0, 1.0);
  //vec3 color = clamp(lambertColor + ambient + emit, 0.0, 1.0);
  
  //compose final color with texture
  vec4 color = vec4(provacolorefinale.rgb,1.0);
  vec4 outColorfs = color * texture(in_texture, fsUV);
  outColor = outColorfs;
}