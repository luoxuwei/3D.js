export default class MeshDepthMaterial {
  constructor(params) {
    this.type = "MeshDepthMaterial";
    this.color = [1, 1, 1, 1];
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


            varying vec4 vPos;
            void main(){
              
              gl_Position = pvMatrix * modelMatrix * v_position;;
              vColor = v_color;
              vUv = uv;
              // 法向和位置经过模型矩阵变换后，变换后在传入片元着色器
              vec4 tempNormal = modelMatrix * vec4(normal,0.0);
              vNormal = tempNormal.xyz;
              vec4 temPosition = modelMatrix * v_position;
              vPosition = temPosition.xyz;
              vPos = gl_Position;
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
      uniform float uLightAngle;
      // 相机位置
      uniform vec3 uEye;

      varying vec4 vPos;
  
      void main(){
        // gl_FragColor = vec4( vec3(gl_FragCoord.z),1.0 );
        // gl_FragColor = vec4(vec3(vPos.z/10.0),1.0);
        // gl_FragColor = vec4( vec3(1.0-pow(gl_FragCoord.z,32.0)),1.0 );
        gl_FragColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w/10.0),1.0 );
      
        
      }`;
  }
}
