"use strict";
var L09_FudgeCraft_Camera;
(function (L09_FudgeCraft_Camera) {
    function test() {
        testGrid();
    }
    L09_FudgeCraft_Camera.test = test;
    function testGrid() {
        let cube = new L09_FudgeCraft_Camera.Cube(L09_FudgeCraft_Camera.CUBE_TYPE.GREEN, L09_FudgeCraft_Camera.ƒ.Vector3.ZERO());
        L09_FudgeCraft_Camera.grid.push(cube.cmpTransform.local.translation, new L09_FudgeCraft_Camera.GridElement(cube));
        let pulled = L09_FudgeCraft_Camera.grid.pull(cube.cmpTransform.local.translation);
        logResult(cube == pulled.cube, "Grid push and pull", cube, pulled.cube, pulled);
        let popped = L09_FudgeCraft_Camera.grid.pop(cube.cmpTransform.local.translation);
        logResult(cube == popped.cube, "Grid pop", cube, popped.cube, popped);
        let empty = L09_FudgeCraft_Camera.grid.pull(cube.cmpTransform.local.translation);
        logResult(empty == undefined, "Grid element deleted");
    }
    function logResult(_success, ..._args) {
        let log = _success ? console.log : console.warn;
        log(`Test success: ${_success}`, _args);
    }
})(L09_FudgeCraft_Camera || (L09_FudgeCraft_Camera = {}));
//# sourceMappingURL=Test.js.map