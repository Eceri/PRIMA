declare namespace L10_FudgeCraft_Combos {
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
