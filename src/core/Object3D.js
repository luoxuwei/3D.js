export default class Object3D {
    constructor() {
        this.type = "Object3D";
        this.children = [];
    }
    add(object) {
        this.children.push(object);
    }
    traverse(callback) {
        callback(this);
        this.children.forEach((child) => {
          child.traverse(callback);
        });
      }
}