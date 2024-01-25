import PerspectiveCamera from "./PerspectiveCamera.js";
import { Vector2 } from "../math/Vector2.js";
export default class SpotLightShadow {
  constructor() {
    this.type = "SpotLightShadow";
    this.camera = new PerspectiveCamera(90, 1, 0.1, 100);
    this.bias = 0;//防止自阴影，就是阴影条纹，在偏移范围内的不算
    this.mapSize = new Vector2(2048, 2048);//记录深度的纹理图片大小
    this.map = null;//记录深度的纹理图片
  }
}
