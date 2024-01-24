import Texture from "./Texture.js";
export default class TextureLoader {
  constructor() {
    this.type = "TextureLoader";
  }
  load(url, callback) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = url;
      image.onload = () => {
        let texture = new Texture(image);
        callback(texture);
        resolve(texture);
      };
      image.onerror = (err) => {
        reject("图片加载失败");
      };
    });
  }
}
