import Object3D from "./Object3D";
export default class Scene extends Object3D {
    constructor() {
        super()
        this.type = "Scence";
        this.background = [1, 1, 1, 1];
    }


}