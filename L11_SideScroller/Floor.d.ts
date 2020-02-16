declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Floor extends CollidableObject {
        protected static mesh: f.MeshSprite;
        private static material;
        constructor(_name?: string);
        get moving(): boolean;
    }
    class MovingFloor extends Floor {
        private speed;
        private originPoint;
        private maxMoveDistance;
        private direction;
        constructor(_origin: f.Vector3, _moveX?: number, _moveY?: number, _direction?: number, _maxMoveDistance?: number);
        get moving(): boolean;
        get moveSpeed(): f.Vector3;
        move(_targetTranslation: f.Vector3, _timeFrame: number): void;
        private checkForReversal;
        private update;
    }
}
