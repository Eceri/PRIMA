"use strict";
var L10_FudgeCraft_Combos;
(function (L10_FudgeCraft_Combos) {
    function startTests() {
        //    testGrid();
        testCombos();
    }
    L10_FudgeCraft_Combos.startTests = startTests;
    function testCombos() {
        let setup = [
            {
                type: L10_FudgeCraft_Combos.CUBE_TYPE.RED,
                positions: [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, -1, 0],
                    [0, 0, -1],
                    [-1, 0, 0]
                ]
            },
            {
                type: L10_FudgeCraft_Combos.CUBE_TYPE.GREEN,
                positions: [
                    [-5, 0, 0],
                    [-5, 0, 1],
                    [-5, 1, 2],
                    [-5, -1, 2]
                ]
            },
            {
                type: L10_FudgeCraft_Combos.CUBE_TYPE.CYAN,
                positions: [
                    [3, 0, 0],
                    [3, 0, 1],
                    [3, 0, 2],
                    [3, 0, 3],
                    [3, 0, 4],
                    [3, 0, 5],
                    [3, 0, 6],
                    [3, 0, -1],
                    [3, 0, -2]
                ]
            }
        ];
        setup.forEach((_combo) => {
            _combo.positions.forEach((_position) => {
                let position = new L10_FudgeCraft_Combos.ƒ.Vector3(..._position);
                let cube = new L10_FudgeCraft_Combos.Cube(_combo.type, position);
                L10_FudgeCraft_Combos.grid.push(position, new L10_FudgeCraft_Combos.GridElement(cube));
            });
        });
        let startElements = setup.map((_combo) => {
            return L10_FudgeCraft_Combos.grid.pull(new L10_FudgeCraft_Combos.ƒ.Vector3(..._combo.positions[0]));
        });
        let combos = new L10_FudgeCraft_Combos.Combos(startElements);
        for (let combo of combos.found)
            for (let element of combo) {
                let mtxLocal = element.cube.cmpTransform.local;
                console.log(element.cube.name, mtxLocal.translation.getMutator());
                // mtxLocal.rotateX(45);
                // mtxLocal.rotateY(45);
                // mtxLocal.rotateY(45, true);
                mtxLocal.scale(L10_FudgeCraft_Combos.ƒ.Vector3.ONE(0.5));
            }
        // updateDisplay();
    }
    function testGrid() {
        let cube = new L10_FudgeCraft_Combos.Cube(L10_FudgeCraft_Combos.CUBE_TYPE.GREEN, L10_FudgeCraft_Combos.ƒ.Vector3.ZERO());
        L10_FudgeCraft_Combos.grid.push(cube.cmpTransform.local.translation, new L10_FudgeCraft_Combos.GridElement(cube));
        let pulled = L10_FudgeCraft_Combos.grid.pull(cube.cmpTransform.local.translation);
        logResult(cube == pulled.cube, "Grid push and pull", cube, pulled.cube, pulled);
        let popped = L10_FudgeCraft_Combos.grid.pop(cube.cmpTransform.local.translation);
        logResult(cube == popped.cube, "Grid pop", cube, popped.cube, popped);
        let empty = L10_FudgeCraft_Combos.grid.pull(cube.cmpTransform.local.translation);
        logResult(empty == undefined, "Grid element deleted");
    }
    function logResult(_success, ..._args) {
        let log = _success ? console.log : console.warn;
        log(`Test success: ${_success}`, _args);
        testGrid();
    }
})(L10_FudgeCraft_Combos || (L10_FudgeCraft_Combos = {}));
//# sourceMappingURL=Test.js.map