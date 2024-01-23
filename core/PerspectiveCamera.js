import Object3D from "./Object3D";
import {Vector3} from "../math/Vector3"

class PerspectiveCamera extends Object3D {
    constructor() {
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