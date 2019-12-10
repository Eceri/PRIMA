namespace L07_FudgeCraft_Fragments {
  import f = FudgeCore;

  export class Fragment extends f.Node {
    private static shapes: number[][][] = Fragment.getShapeArray();
    public position: f.Vector3 = new f.Vector3(0, 0, 0);

    constructor(_shape: number) {
      super("Fragment-Type" + _shape);
      let shape: number[][] = Fragment.shapes[_shape];
      for (let position of shape) {
        let type: CUBE_TYPE = Fragment.getRandomEnum(CUBE_TYPE);
        let vctPosition: f.Vector3 = f.Vector3.ZERO();
        vctPosition.set(position[0], position[1], position[2]);
        let cube: Cube = new Cube(type, vctPosition);
        this.appendChild(cube);
      }
    }

    private static getShapeArray(): number[][][] {
      return [
        // corner
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ],
        // quad
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [1, 1, 0]
        ],
        // s
        [
          [0, 0, 0],
          [0, 1, 0],
          [1, 0, 0],
          [1, -1, 0]
        ]
      ];
    }

    private static getRandomEnum<T>(_enum: { [key: string]: T }): T {
      let randomKey: string = Object.keys(_enum)[
        Math.floor(Math.random() * Object.keys(_enum).length)
      ];
      return _enum[randomKey];
    }
  }
}
