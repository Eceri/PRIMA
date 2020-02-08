namespace L10_FudgeCraft_Combos {
  export class GridElement {
    public cube: Cube;

    constructor(_cube: Cube = null) {
      this.cube = _cube;
    }
  }

  export class Grid extends Map<string, GridElement> {
    // private grid: Map<string, Cube> = new Map();
    constructor() {
      super();
      this.push(
        ƒ.Vector3.ZERO(),
        new GridElement(new Cube(CUBE_TYPE.GREY, ƒ.Vector3.ZERO()))
      );
    }

    push(_position: ƒ.Vector3, _element: GridElement = null): void {
      let key: string = this.toKey(_position);
      this.set(key, _element);
      if (_element) game.appendChild(_element.cube);
    }

    pull(_position: ƒ.Vector3): GridElement {
      let key: string = this.toKey(_position);
      let element: GridElement = this.get(key);
      return element;
    }

    pop(_position: ƒ.Vector3): GridElement {
      let key: string = this.toKey(_position);
      let element: GridElement = this.get(key);
      this.delete(key);
      if (element) game.removeChild(element.cube);
      return element;
    }

    toKey(_position: ƒ.Vector3): string {
      let position: ƒ.Vector3 = _position.map(Math.round);
      let key: string = position.toString();
      return key;
    }

    public findNeigbors(_of: ƒ.Vector3): GridElement[] {
      let found: GridElement[] = [];
      let offsets: number[][] = [
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0]
      ];
      for (let offset of offsets) {
        let posNeighbor: ƒ.Vector3 = ƒ.Vector3.SUM(
          _of,
          new ƒ.Vector3(...offset)
        );
        let neighbor: GridElement = grid.pull(posNeighbor);
        if (neighbor) found.push(neighbor);
      }
      return found;
    }
  }
}
