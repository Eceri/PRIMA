declare namespace L09_FudgeCraft_Camera {
    class GridElement {
        cube: Cube;
        constructor(_cube?: Cube);
    }
    class Grid extends Map<string, GridElement> {
        constructor();
        push(_position: ƒ.Vector3, _element?: GridElement): void;
        pull(_position: ƒ.Vector3): GridElement;
        pop(_position: ƒ.Vector3): GridElement;
        toKey(_position: ƒ.Vector3): string;
    }
}
