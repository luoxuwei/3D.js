export default class MeshLambertMaterial {
  constructor(params) {
    this.type = "MeshLambertMaterial";
    this.color = params.color || [1, 1, 1, 1];
    this.isVerticesColor = true;

    this.vertexShader = /*glsl*/ `
            attribute vec4 v_position;
            attribute vec4 v_color;
            attribute vec2 uv;
            attribute vec3 normal;
            varying vec2 vUv;
            varying vec4 vColor;
            varying vec3 vNormal;
            varying vec3 vPosition;

            // 模型矩阵
            uniform mat4 modelMatrix;
            // 视图投影矩阵
            uniform mat4 pvMatrix; 
            void main(){
              
              gl_Position = pvMatrix * modelMatrix * v_position;;
              vColor = v_color;
              vUv = uv;
              vNormal = normal;
              vPosition = v_position.xyz;
            }
          `;

    this.fragmentShader = /*glsl*/ `
      precision mediump float;
      varying vec4 vColor;
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform int u_hasTexture;
      varying vec3 vNormal;
      uniform vec4 u_color;
      varying vec3 vPosition;
      // 灯光的unifom
      uniform vec3 lightColor;
      uniform vec3 lightDir;
      uniform vec3 lightPos;
  
      void main(){

        vec3 lightPos = vec3(2.0,2.0,10.0);
        vec3 lightDir = normalize(lightPos-vPosition);
        vec3 lightColor = vec3(1.0,1.0,1.0);
        vec3 normal = normalize(vNormal);
        // 计算出lamert光照强度，由单位法向量和单位光线方向向量点乘得到，角度越大光越弱，向量相乘得到cos
        float lambert = max(dot(normal,lightDir),0.0);

        vec4 textureColor = u_hasTexture==1 ? texture2D(u_texture,vUv):vec4(1.0,1.0,1.0,1.0);
        // gl_FragColor = textureColor;
        // gl_FragColor = vec4(vUv,0.0,1.0);
        // 琅勃特材质 = 光照强度*光照颜色*纹理颜色*材质颜色
        //textureColor*u_color是一点点的漫反射，类似环境光，如果没有这部分，光照不到的地方应该是黑色
        //lambert*vec4(lightColor,1.0)*textureColor*u_color 是直接光照的漫反射
        vec4 finialColor = textureColor*u_color+lambert*vec4(lightColor,1.0)*textureColor*u_color;
        gl_FragColor = vec4(finialColor.rgb,1.0);

        // gl_FragColor = u_color*textureColor;
      
      
      }`;
  }
}
