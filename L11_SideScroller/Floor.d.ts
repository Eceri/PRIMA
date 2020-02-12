declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Floor extends f.Node {
        private static mesh;
        private static material;
        private static readonly pivot;
        constructor();
        getRectWorld(): f.Rectangle;
    }
}
