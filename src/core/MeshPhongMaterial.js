export default class MeshPhongMaterial {
  constructor(params) {
    this.type = "MeshPhongMaterial";
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

            // 转换灯光投影的位置
            varying vec4 vClipPosLight;
            uniform mat4 lightShadowPVMatrix;

            // 模型矩阵
            uniform mat4 modelMatrix;
            // 视图投影矩阵
            uniform mat4 pvMatrix; 
            void main(){
              
              gl_Position = pvMatrix * modelMatrix * v_position;;
              vColor = v_color;
              vUv = uv;
              // 法向和位置经过模型矩阵变换后，变换后在传入片元着色器
              vec4 tempNormal = modelMatrix * vec4(normal,0.0);
              vNormal = tempNormal.xyz;
              vec4 temPosition = modelMatrix * v_position;
              vPosition = temPosition.xyz;
              vClipPosLight = lightShadowPVMatrix * modelMatrix * v_position;
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

      varying vec4 vClipPosLight;

      uniform sampler2D u_shadowMap;

      // 判断是否在阴影里
      bool isInShadow(){
        //转换到屏幕坐标空间，-1,1 => 0,1
        vec3 fragPos = (vClipPosLight.xyz/vClipPosLight.w)/2.0+0.5;
        vec4 shadowFrag = texture2D(u_shadowMap,fragPos.xy);
        //深度材质里除了10，所以这里也要除10
        //当前的深度比原来拍的深度大说明灯光被遮挡
        return vClipPosLight.z/10.0 > shadowFrag.r;
      }

      //调试用
      float Shadow(){
        vec3 fragPos = (vClipPosLight.xyz/vClipPosLight.w)/2.0+0.5;
        vec4 shadowFrag = texture2D(u_shadowMap,fragPos.xy);
        return shadowFrag.r;
      }
  
      void main(){

        // vec3 lightPos = vec3(2.0,2.0,10.0);
        vec3 lightDirection = normalize(lightPos-vPosition);
        // vec3 lightColor = vec3(1.0,1.0,1.0);
        vec3 normal = normalize(vNormal);
        // 计算出lamert光照强度，由单位法向量和单位光线方向向量点乘得到
        float lambert = max(dot(normal,lightDirection),0.0);

        // 光线与聚光灯方向的夹角
        float angle = dot(lightDirection,normalize(lightDir));

        // 光线到物体的距离
        float distance = length(lightPos-vPosition);
        float distanceStrength = 1.0 - smoothstep(5.0,6.0,distance);

        // 聚光灯角度衰减
        float angleStrength = 1.0 - smoothstep(cos(uLightAngle/2.0-0.15),cos(uLightAngle/2.0),angle);

        // lambert = angle < cos(uLightAngle/2.0) ? 0.0:lambert;
        lambert = distanceStrength * angleStrength*lambert;

        vec4 textureColor = u_hasTexture==1 ? texture2D(u_texture,vUv):vec4(1.0,1.0,1.0,1.0);
        // gl_FragColor = textureColor;
        // gl_FragColor = vec4(vUv,0.0,1.0);
        // 视点看向当前着色点的向量
        vec3 eyeDirection = normalize(uEye-vPosition);
        // 入射光与视角的角平分线方向
        vec3 halfDirection = normalize(lightDirection+eyeDirection);
        // 高光强度
        float specular = pow(max(dot(normal,halfDirection),0.0),128.0);


        // // phong材质 = 光照强度*光照颜色*纹理颜色*材质颜色+高光强度*高光颜色
        // vec4 finialColor = textureColor*u_color+lambert*vec4(lightColor,1.0)*textureColor*u_color+specular*vec4(1.0,1.0,1.0,1.0);
        // gl_FragColor = vec4(finialColor.rgb,1.0);

        // // gl_FragColor = u_color*textureColor;
      
        vec4 baseColor = textureColor*u_color;

        vec4 lambertColor = baseColor+lambert*vec4(lightColor,1.0)*textureColor*u_color;
        // phong材质 = 光照强度*光照颜色*纹理颜色*材质颜色+高光强度*高光颜色
        vec4 finialColor = lambertColor+specular*vec4(1.0,1.0,1.0,1.0);
        gl_FragColor = vec4(finialColor.rgb,1.0);

        gl_FragColor = isInShadow() ? vec4(baseColor.xyz,1.0):gl_FragColor;

        // gl_FragColor = vec4(vec3(pow( Shadow(),1.0)),1.0);
      
      }`;
  }
}
