export default class PlaneGeometry {
  constructor(width = 1, height = 1) {
    this.type = "PlaneGeometry";
    let vertices = [
      [-0.5 * width, -0.5 * height, 0, 1.0],
      [-0.5 * width, 0.5 * height, 0, 1.0],
      [0.5 * width, 0.5 * height, 0, 1.0],
      [0.5 * width, -0.5 * height, 0, 1.0],
    ];
    let faces = [[1, 0, 3, 2]];

    let faceColors = [
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
    ];

    let uv = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ];

    // 添加normal
    let normals = [
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
    ];

    let points = [];
    let colors = [];
    let index = [];
    faces.forEach((face, i) => {
      // 生成顶点索引
      index.push(face[0], face[1], face[2], face[0], face[2], face[3]);
    });

    this.index = new Uint16Array(index);

    this.attributes = {
      position: new Float32Array(vertices.flat()),
      colors: new Float32Array(faceColors.flat()),
      uv: new Float32Array(uv.flat()),
      normal: new Float32Array(normals.flat()),
    };

    this.bufferData = {};
  }
}
