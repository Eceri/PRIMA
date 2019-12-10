declare namespace L09_FudgeCraft_Camera {
    import ƒ = FudgeCore;
    class Fragment extends ƒ.Node {
        private static shapes;
        position: ƒ.Vector3;
        constructor(_shape: number, _position?: ƒ.Vector3);
        static getRandom(): Fragment;
        private static getShapeArray;
        private static getRandomEnum;
    }
}
