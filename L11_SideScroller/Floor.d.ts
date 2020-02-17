declare namespace L11_SideScroller {
    import f = FudgeCore;
    enum FLOORTYPE {
        RECT = "Rectangle",
        THINRECT = "ThinRectangle"
    }
    class Floor extends CollidableObject {
        protected static sprites: Sprite[];
        protected static mesh: f.MeshSprite;
        static txtImage: f.TextureImage;
        static material: f.Material;
        /**
         * @param _position position of the floor tile
         * @param _type type of the Floor: Thin or Rectangle
         */
        constructor(_position: f.Vector3, _type: FLOORTYPE);
        get moving(): boolean;
    }
    class MovingFloor extends Floor {
        private speed;
        private originPoint;
        private maxMoveDistance;
        private direction;
        constructor(_origin: f.Vector3, _moveSpeed: f.Vector3, _type: FLOORTYPE, _direction?: number, _maxMoveDistance?: number);
        get moving(): boolean;
        get moveSpeed(): f.Vector3;
        move(_targetTranslation: f.Vector3, _timeFrame: number): void;
        private checkForReversal;
        private update;
    }
}
