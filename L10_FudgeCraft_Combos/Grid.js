"use strict";
var L10_FudgeCraft_Combos;
(function (L10_FudgeCraft_Combos) {
    class GridElement {
        constructor(_cube = null) {
            this.cube = _cube;
        }
    }
    L10_FudgeCraft_Combos.GridElement = GridElement;
    class Grid extends Map {
        // private grid: Map<string, Cube> = new Map();
        constructor() {
            super();
            this.push(L10_FudgeCraft_Combos.ƒ.Vector3.ZERO(), new GridElement(new L10_FudgeCraft_Combos.Cube(L10_FudgeCraft_Combos.CUBE_TYPE.GREY, L10_FudgeCraft_Combos.ƒ.Vector3.ZERO())));
        }
        push(_position, _element = null) {
            let key = this.toKey(_position);
            this.set(key, _element);
            if (_element)
                L10_FudgeCraft_Combos.game.appendChild(_element.cube);
        }
        pull(_position) {
            let key = this.toKey(_position);
            let element = this.get(key);
            return element;
        }
        pop(_position) {
            let key = this.toKey(_position);
            let element = this.get(key);
            this.delete(key);
            if (element)
                L10_FudgeCraft_Combos.game.removeChild(element.cube);
            return element;
        }
        toKey(_position) {
            let position = _position.map(Math.round);
            let key = position.toString();
            return key;
        }
        findNeigbors(_of) {
            let found = [];
            let offsets = [
                [0, 0, 1],
                [0, 0, -1],
                [0, 1, 0],
                [0, -1, 0],
                [1, 0, 0],
                [-1, 0, 0]
            ];
            for (let offset of offsets) {
                let posNeighbor = L10_FudgeCraft_Combos.ƒ.Vector3.SUM(_of, new L10_FudgeCraft_Combos.ƒ.Vector3(...offset));
                let neighbor = L10_FudgeCraft_Combos.grid.pull(posNeighbor);
                if (neighbor)
                    found.push(neighbor);
            }
            return found;
        }
    }
    L10_FudgeCraft_Combos.Grid = Grid;
})(L10_FudgeCraft_Combos || (L10_FudgeCraft_Combos = {}));
//# sourceMappingURL=Grid.js.map