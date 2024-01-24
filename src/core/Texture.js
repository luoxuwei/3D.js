export default class Texture {
  constructor(image) {
    this.type = "Texture";
    this.image = image;
    this.isTexture = true;
    this.wrapS = textParams.TEXTURE_WRAP_S.REPEAT;
    this.wrapT = textParams.TEXTURE_WRAP_T.REPEAT;
    this.magFilter = textParams.TEXTURE_MAG_FILTER.LINEAR;
    this.minFilter = textParams.TEXTURE_MIN_FILTER.LINEAR;
  }
}

const textParams = {
  // 纹理的放大滤镜
  TEXTURE_MAG_FILTER: {
    LINEAR: "LINEAR",
    NEAREST: "NEAREST",
  },
  // 纹理的缩小滤镜
  TEXTURE_MIN_FILTER: {
    LINEAR: "LINEAR",
    NEAREST: "NEAREST",
    NEAREST_MIPMAP_NEAREST: "NEAREST_MIPMAP_NEAREST",
    LINEAR_MIPMAP_NEAREST: "LINEAR_MIPMAP_NEAREST",
    NEAREST_MIPMAP_LINEAR: "NEAREST_MIPMAP_LINEAR",
    LINEAR_MIPMAP_LINEAR: "LINEAR_MIPMAP_LINEAR",
  },
  // 纹理坐标的重复方式
  TEXTURE_WRAP_S: {
    CLAMP_TO_EDGE: "CLAMP_TO_EDGE",
    MIRRORED_REPEAT: "MIRRORED_REPEAT",
    REPEAT: "REPEAT",
  },
  TEXTURE_WRAP_T: {
    CLAMP_TO_EDGE: "CLAMP_TO_EDGE",
    MIRRORED_REPEAT: "MIRRORED_REPEAT",
    REPEAT: "REPEAT",
  },
};
