import Object3D from "./Object3D.js";
import { Vector3 } from "../math/Vector3.js";
export default class SpotLight extends Object3D {
  constructor(color, intensity) {
    super();
    this.type = "SpotLight";
    this.isLight = true;
    this.color = color || [1, 1, 1, 1];
    this.intensity = intensity || 1;
    this.position = new Vector3(0, 0, 0);
    this.target = new Vector3(0, 0, 0);
    this.angle = Math.PI / 3;
  }
}
