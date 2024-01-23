import Object3D from "./Object3D.js";
import { Vector3 } from "../math/Vector3.js";

export default class PerspectiveCamera extends Object3D {
  constructor(fov, aspect, near, far) {
    super();
    this.type = "PerspectiveCamera";
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    // 相机位置
    this.position = new Vector3(0, 0, 0);
    // 更新透视矩阵
    this.updateViewMatrix();
    // 相机查看方向
    this.cameraDirection = new Vector3(-1, -1, -1);
    this.cameraUp = new Vector3(-1, 2, -1);
  }
  updateViewMatrix() {
    let { fov, aspect, near, far } = this;

    let pMatrix = [
      [1 / (aspect * Math.tan((fov * Math.PI) / 360)), 0, 0, 0],
      [0, 1 / Math.tan((fov * Math.PI) / 360), 0, 0],
      [0, 0, (far + near) / (far - near), 1],
      [0, 0, (-2 * far * near) / (far - near), 0],
    ];
    this.pMatrix = pMatrix;
    this.viewMatrix = new Float32Array(pMatrix);
  }
}
