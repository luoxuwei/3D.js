import Object3D from "./Object3D.js";
import { Vector3 } from "../math/Vector3.js";
import SpotLightShadow from "./SpotLightShadow.js";
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
    // 设置阴影
    this.castShadow = true;
    this.shadow = new SpotLightShadow();
  }
  updateCamera() {
    this.shadow.camera.position.copy(this.position);
    this.shadow.camera.lookAt(this.target);
  }
}
