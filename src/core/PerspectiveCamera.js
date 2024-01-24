import Object3D from "./Object3D.js";
import { Vector3 } from "../math/Vector3.js";
import { Euler } from "../math/Euler.js";
import { Quaternion } from "../math/Quaternion.js";
import { Matrix4 } from "../math/Matrix4.js";

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
    // // 更新透视矩阵
    // this.updateViewMatrix();
    // 相机查看方向
    this.cameraDirection = new Vector3(-1, -1, -1);
    this.cameraUp = new Vector3(-1, 2, -1);

    this.up = new Vector3(0, 1, 0);
    //相机位置/旋转信息

    this.position = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.quaternion = new Quaternion();
    this.matrix = new Matrix4();
    // 逆变换矩阵-视图矩阵
    this.matrixReverse = new Matrix4();
    // 投影矩阵
    this.projectionMatrix = new Matrix4();
    // 视图投影矩阵
    this.pvMatrix = new Matrix4();
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
    this.projectionMatrix = this.projectionMatrix.fromArray(pMatrix.flat());
  }
  updateMatrix() {
    // 根据旋转的欧拉角，更新四元数
    this.quaternion.setFromEuler(this.rotation);
    // 根据位置、旋转、缩放，更新矩阵
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.updateMatrixReverse();
    this.updatePvMatrix();
  }
  updateMatrixReverse() {
    // 逆变换矩阵
    this.matrixReverse = this.matrix.clone().invert();
  }
  updatePvMatrix() {
    // 更新视图投影矩阵
    this.pvMatrix = this.projectionMatrix.clone().multiply(this.matrixReverse);
  }
  lookAt(target) {
    console.log(this.position, target, this.up);
    // 根据位置/目标点/上方向，更新矩阵
    // console.log(this.matrix.toArray());
    this.matrix.makeTranslation(
      this.position.x,
      this.position.y,
      this.position.z
    );
    //lookAt只有旋转没有位移，所以上面必须先位移
    this.matrix.lookAt(target, this.position, this.up);

    console.log(this.matrix.toArray());
    // 根据矩阵，更新旋转的四元数
    this.quaternion.setFromRotationMatrix(this.matrix);
    // 根据四元数，更新旋转的欧拉角
    this.rotation.setFromQuaternion(this.quaternion);
    // 更新逆变换矩阵
    this.updateMatrixReverse();
    // 更新视图投影矩阵
    this.updatePvMatrix();
  }

}
