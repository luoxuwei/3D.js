export default class BoxGeometry {
    constructor() {
        this.type = "BoxGeometry";
        let vertices = [
          [-0.5, -0.5, 0.5, 1.0],
          [-0.5, 0.5, 0.5, 1.0],
          [0.5, 0.5, 0.5, 1.0],
          [0.5, -0.5, 0.5, 1.0],
          [-0.5, -0.5, -0.5, 1.0],
          [-0.5, 0.5, -0.5, 1.0],
          [0.5, 0.5, -0.5, 1.0],
          [0.5, -0.5, -0.5, 1.0],
        ];
        let faces = [
          [1, 0, 3, 2],
          [2, 3, 7, 6],
          [3, 0, 4, 7],
          [6, 5, 1, 2],
          [4, 5, 6, 7],
          [5, 4, 0, 1],
        ];
    
        let faceColors = [
          [1.0, 0.0, 0.0, 1.0],
          [0.0, 1.0, 0.0, 1.0],
          [0.0, 0.0, 1.0, 1.0],
          [1.0, 1.0, 0.0, 1.0],
          [1.0, 0.0, 1.0, 1.0],
          [0.0, 1.0, 1.0, 1.0],
        ];
        let points = [];
        let colors = [];
        faces.forEach((face, i) => {
          let faceIndices = [face[0], face[1], face[2], face[0], face[2], face[3]];
          faceIndices.forEach((index) => {
            points.push(vertices[index]);
            colors.push(faceColors[i]);
          });
        });
    
        this.attributes = {
          position: new Float32Array(points.flat()),
          colors: new Float32Array(colors.flat()),
        };
        this.bufferData = {};
    }
}