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
        private static projectileSprite;
        private static speedMax;
        private static gravity;
        speed: f.Vector3;
        private framesSinceLock;
        lockedInAnimation: boolean;
        private direction;
        grounded: boolean;
        private currentWeapon;
        private lastWeaponSwapTime;
        constructor(_name?: string);
        private showNextFrame;
        static generateSprites(_txtImage: f.TextureImage): void;
        private update;
        private getActiveNodeSprite;
        swapWeapon(): void;
        show(_action: ACTION): void;
        act(_action: ACTION, _direction?: DIRECTION): void;
        private spawnScepterProjectile;
        getRectWorld(): f.Rectangle;
        private checkCollision;
    }
}
