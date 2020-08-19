#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec3 fs_pos;
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
uniform float pLTagret;
uniform float pLDecay;

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

  //computing position and color of point light
  vec3 lDir = normalize(pLPos - fs_pos);
	vec3 lCol = pLCol * pow(2.0 / length(pLPos - fs_pos), 2.0);

  //spot
  float LAConeOut = 60.0;
  float LAConeIn = 45.0;
  float LCosOut = cos(radians(LAConeOut / 2.0));
	float LCosIn = cos(radians(LAConeOut * LAConeIn / 2.0));
	//lightDirA = normalize(LAPos - fs_pos);
	float CosAngle = dot(lDir, lDirA);
	lCol = pLCol * pow(2.0 / length(pLPos - fs_pos), 1.0) * clamp((CosAngle - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);

  vec3 diffuseLambertPoint = compDiffuse(lDir,lCol,nNormal);

  //vec3 lambertColor = mDiffColor * (diffA + diffB) + mDiffColor * diffuseLambertPoint;
  vec3 lambertColor = mDiffColor * diffuseLambertPoint;
  
  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing Blinn specular color
  /*vec3 eyeDir = normalize(eyePos - fs_pos);
  vec3 halfVecA = normalize(eyeDir + lDirA);
  vec3 halfVecB = normalize(eyeDir + lDirB);
  vec3 specularA = pow(max(dot(halfVecA, nNormal), 0.0), specShine) * lightColorA;
  vec3 specularB = pow(max(dot(halfVecB, nNormal), 0.0), specShine) * lightColorB;
  vec3 blinnSpecular = specularColor * (specularA + specularB); */
  
  //computing BRDF color
  //vec3 color = clamp(blinnSpecular + lambertColor + ambient + emit, 0.0, 1.0);
  vec3 color = clamp(lambertColor + ambient + emit, 0.0, 1.0);
  
  //compose final color with texture
  outColor = vec4(texelCol.rgb * color, texelCol.a);
}