declare namespace L11_SideScroller {
    abstract class CollidableObject extends f.Node {
        protected static readonly pivot: f.Matrix4x4;
        constructor(_name: string);
        getRectWorld(): f.Rectangle;
    }
}
