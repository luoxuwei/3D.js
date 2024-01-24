export default class SphereGeometry {
  constructor(
    radius = 1,
    //球体是分段的，一圈有多少个点是固定的
    //https://threejs.org/docs/?q=sp#api/zh/geometries/SphereGeometry
    widthSegments = 8,
    heightSegments = 6,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI
  ) {
    this.type = "SphereGeometry";

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI); // 0 ~ PI
    // 索引值
    const indices = [];
    // 顶点值
    const vertices = [];
    // 法线值
    const normals = [];
    // uv值
    const uvs = [];

    // 生成球体顶点
    for (let y = 0; y <= heightSegments; y++) {
      // 创建保存每一行的数组
      const v = y / heightSegments;
      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments; //0到2π的多少分之一
        const theta = v * thetaLength + thetaStart;
        const phi = u * phiLength + phiStart;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const px = radius * sinTheta * cosPhi;
        const py = radius * cosTheta;
        const pz = radius * sinTheta * sinPhi;

        vertices.push(px, py, pz, 1.0);
        // 生成法线
        //就顶点过圆心的线
        normals.push(px, py, pz);

        // 生成uv
        //球体的一圈对应纹理图片的一条线，球体极点的一个点就是图片的一条边
        uvs.push(u, v);
      }
    }

    // 生成索引
    //把上一行和下一行的索引关联起来，6个顶点形成一个四边形
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const v1 = y * (widthSegments + 1) + x + 1;
        const v2 = y * (widthSegments + 1) + x;
        const v3 = (y + 1) * (widthSegments + 1) + x;
        const v4 = (y + 1) * (widthSegments + 1) + x + 1;
        //两个三角形，形成一个四边形
        indices.push(v1, v2, v4);
        indices.push(v2, v3, v4);
      }
    }

    this.index = new Uint16Array(indices);

    this.attributes = {
      position: new Float32Array(vertices.flat()),
      normal: new Float32Array(normals.flat()),
      uv: new Float32Array(uvs.flat()),
    };

    this.bufferData = {};
  }
}
