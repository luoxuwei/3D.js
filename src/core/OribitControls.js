import { Vector3 } from "../math/Vector3.js";

export default class OribitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
    
        // 创建一个鼠标位置距离
        this.mouse = {
          x: 0,
          y: 0,
          down: false,
        };
        // 绕着目标旋转
        this.target = new Vector3(0, 0, 0);
    
        // 获取轨道半径
        this.radius = this.camera.position.distanceTo(this.target);
    
        // 获取旋转角度
        this.rotate = {
          theta: Math.atan2(this.camera.position.x, this.camera.position.z),
          phi: Math.acos(this.camera.position.y / this.radius),
        };
        //bind this，不绑定this直接把函数传进去，函数被调用时，this就不是指向当前的OribitControls了
        this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
      }
    
      onMouseDown(event) {
        this.mouse.down = true;
      }
      onMouseUp(event) {
        this.mouse.down = false;
      }    
      onMouseMove(event) {
        if (this.mouse.down) {
          let x = event.movementX;
          let y = event.movementY;
          //可能鼠标快速滑过去，滑动的距离就很大，会有抖动，所以这里对这个值作一下处理
          if (x > 3) x = 3;
          if (x < -3) x = -3;
          if (y > 3) y = 3;
          if (y < -3) y = -3;
          this.rotate.theta -= x * 0.01;
          this.rotate.phi -= y * 0.01;
    
          // 限制phi的范围
          if (this.rotate.phi < 0.1) {
            this.rotate.phi = 0.1;
          }
          if (this.rotate.phi > Math.PI - 0.1) {
            this.rotate.phi = Math.PI - 0.1;
          }
    
          //  根据角度计算相机位置
          this.camera.position.x =
            this.radius * Math.sin(this.rotate.phi) * Math.cos(this.rotate.theta);
    
          this.camera.position.y = this.radius * Math.cos(this.rotate.phi);
          this.camera.position.z =
            this.radius * Math.sin(this.rotate.phi) * Math.sin(this.rotate.theta);
    
          this.camera.lookAt(this.target);
          console.log(this.camera);
        }
      }
}