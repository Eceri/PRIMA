declare namespace L09_FudgeCraft_Camera {
    import ƒ = FudgeCore;
    class CameraControl extends ƒ.Node {
        private camera;
        private xAxisRotator;
        private maxAngle;
        minDistance: number;
        constructor(_maxAngle?: number);
        readonly cmpCamera: ƒ.ComponentCamera;
        readonly xRotator: ƒ.Node;
        translate(_distanceDelta: number): void;
        setDistance(_distance: number): void;
        setRotationY(_angle: number): void;
        setRotationX(_angle: number): void;
        rotateY(_delta: number): void;
        rotateX(_delta: number): void;
    }
}
