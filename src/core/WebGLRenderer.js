export default class WebGLRenderer {
    constructor() {
      this.type = "WebGLRenderer";
      this.programs = {};
      this.domElement = document.createElement("canvas"); // 创建一个canvas元素
      this.gl = this.domElement.getContext("webgl"); // 获取webgl上下文
      // 设置深度检测
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    setSize(width, height) {
      this.domElement.width = width;
      this.domElement.height = height;
      this.domElement.style.width = width + "px";
      this.domElement.style.height = height + "px";
      this.gl.viewport(0, 0, width, height);
    }
    render(scene, camera) {
      // 清空画布
      this.gl.clearColor(...scene.background);
      // 循环遍历场景中的物体
      scene.traverse((object) => {
        if (object.type === "Mesh") {
          // 如果是网格对象，就调用渲染网格对象的方法
          this.renderMesh(object, camera);
        }
      });
    }
    renderMesh(mesh, camera) {
      // 获取网格对象的几何体
      const geometry = mesh.geometry;
      // 获取网格对象的材质
      const material = mesh.material;
      // 获取几何体的顶点数据
      const position = geometry.attributes.position;
      // 生成着色器程序
      const program = this.getProgram(material);
      // 使用着色器程序
      this.gl.useProgram(program);
      // 设置顶点着色器属性
      console.log("program", program);
      this.setVertexShaderAttribute(program, mesh);
      // 设置FragmentShader的uniform
      this.setFragmentShader(program, material);
      // 设置模型矩阵
      this.setModelMatrix(program, mesh);
      // 设置视图矩阵
      this.setViewMatrix(program, camera);
      // 绘制
      this.gl.drawArrays(
        this.gl.TRIANGLES,
        0,
        geometry.attributes.position.length / 4
      );
    }
    setFragmentShader(program, material) {}
    setModelMatrix(program, mesh) {
      mesh.updateRatatationMatrix();
      //设置物体旋转矩阵的uniform
      const rotationMatrix = this.gl.getUniformLocation(
        program,
        "rotationMatrix"
      );
      this.gl.uniformMatrix4fv(rotationMatrix, false, mesh.rotationMatrix);
    }
    setViewMatrix(program, camera) {
      let pMatrixLocation = this.gl.getUniformLocation(program, "pMatrix");
      this.gl.uniformMatrix4fv(pMatrixLocation, false, camera.pMatrix.flat());
      let cameraPositionLocation = this.gl.getUniformLocation(
        program,
        "cameraPosition"
      );
      this.gl.uniform4fv(
        cameraPositionLocation,
        new Float32Array([
          camera.position.x,
          camera.position.y,
          camera.position.z,
          1,
        ])
      );
      let cameraDirectionLocation = this.gl.getUniformLocation(
        program,
        "cameraDirection"
      );
      this.gl.uniform4fv(
        cameraDirectionLocation,
        new Float32Array([
          camera.cameraDirection.x,
          camera.cameraDirection.y,
          camera.cameraDirection.z,
          1,
        ])
      );
      let cameraUpLocation = this.gl.getUniformLocation(program, "cameraUp");
      this.gl.uniform4fv(
        cameraUpLocation,
        new Float32Array([
          camera.cameraUp.x,
          camera.cameraUp.y,
          camera.cameraUp.z,
          1,
        ])
      );
      let aspectLocation = this.gl.getUniformLocation(program, "aspect");
      this.gl.uniform1f(aspectLocation, camera.aspect);
      let nearLocation = this.gl.getUniformLocation(program, "near");
      this.gl.uniform1f(nearLocation, camera.near);
      let farLocation = this.gl.getUniformLocation(program, "far");
      this.gl.uniform1f(farLocation, camera.far);
    }
    setVertexShaderAttribute(program, mesh) {
      // 获取几何体的顶点数据
      const geometry = mesh.geometry;
      const position = geometry.attributes.position;
      // 获取顶点着色器的属性
  
      const positionLocation = this.gl.getAttribLocation(program, "v_position");
      // 创建缓冲区对象
      if (!geometry.bufferData.position) {
        geometry.bufferData.position = this.gl.createBuffer();
      }
  
      // 绑定缓冲区对象
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.bufferData.position);
      // 把顶点数据写入缓冲区对象
      this.gl.bufferData(this.gl.ARRAY_BUFFER, position, this.gl.STATIC_DRAW);
      // 把缓冲区对象分配给属性
      this.gl.vertexAttribPointer(
        positionLocation,
        4,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      // 开启属性
      this.gl.enableVertexAttribArray(positionLocation);
      // 如果有顶点着色器的颜色属性
      if (geometry.attributes && geometry.attributes.colors) {
        const colors = geometry.attributes.colors;
        const colorLocation = this.gl.getAttribLocation(program, "v_color");
        if (!geometry.bufferData.colors) {
          geometry.bufferData.colors = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.bufferData.colors);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(colorLocation);
      }
  

    }
    getProgram(material) {
      // 获取材质的类型
      const type = material.type;
      // 如果着色器程序已经存在，就直接返回
      if (this.programs[type]) {
        return this.programs[type];
      }
      // 如果着色器程序不存在，就创建着色器程序
      const program = this.createProgram(material);
      // 把着色器程序保存起来
      this.programs[type] = program;
      return program;
    }
    createProgram(material) {
      let vertexShader = this.createShader(
        this.gl.VERTEX_SHADER,
        material.vertexShader
      );
      let fragmentShader = this.createShader(
        this.gl.FRAGMENT_SHADER,
        material.fragmentShader
      );
      // 创建着色器程序
      const program = this.gl.createProgram();
      // 把着色器附加到着色器程序
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      // 链接着色器程序
      this.gl.linkProgram(program);
      return program;
    }
    createShader(type, source) {
      // 创建着色器对象
      const shader = this.gl.createShader(type);
      // 设置着色器源码
      this.gl.shaderSource(shader, source);
      // 编译着色器
      this.gl.compileShader(shader);
      // 返回着色器对象
      return shader;
    }
  }
  