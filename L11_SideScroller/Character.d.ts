declare namespace L11_SideScroller {
    import f = FudgeCore;
    enum ACTION {
        IDLE = "Idle",
        WALK = "Walk",
        JUMP = "Jump",
        FALL = "Fall",
        ATTACK = "Attack"
    }
    enum DIRECTION {
        LEFT = 0,
        RIGHT = 1
    }
    class Character extends f.Node {
        private static sprites;
        private static speedMax;
        private static gravity;
        speed: f.Vector3;
        private lastFrameTime;
        private framesSinceLock;
        lockedInAnimation: boolean;
        private animationTime;
        private direction;
        grounded: boolean;
        private currentWeapon;
        private lastWeaponSwapTime;
        constructor(_name?: string);
        static generateSprites(_txtImage: f.TextureImage): void;
        private getActiveNodeSprite;
        swapWeapon(): void;
        show(_action: ACTION): void;
        act(_action: ACTION, _direction?: DIRECTION): void;
        private spawnScepterProjectile;
        private update;
        getRectWorld(): f.Rectangle;
        private checkCollision;
    }
}
