declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Floor extends CollidableObject {
        protected static sprite: Sprite;
        protected static mesh: f.MeshSprite;
        private static material;
        /**
         * @param _position position of the floor tile,
         */
        constructor(_position: f.Vector3);
        get moving(): boolean;
        static generateSprites(_txtImage: f.TextureImage): void;
    }
    class MovingFloor extends Floor {
        private speed;
        private originPoint;
        private maxMoveDistance;
        private direction;
        constructor(_origin: f.Vector3, _moveSpeed: f.Vector3, _direction?: number, _maxMoveDistance?: number);
        get moving(): boolean;
        get moveSpeed(): f.Vector3;
        move(_targetTranslation: f.Vector3, _timeFrame: number): void;
        private checkForReversal;
        private update;
    }
}
