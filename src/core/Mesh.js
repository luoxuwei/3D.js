import { Matrix4 } from "../math/Matrix4.js";
import { Vector3 } from "../math/Vector3.js";
import { Euler } from "../math/Euler.js";
import Object3D from "./Object3D.js";
export default class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.type = "Mesh";
    this.geometry = geometry;
    this.material = material;
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.modelMatrix = new Matrix4();
    this.rotationMatrix = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);
  }
}
