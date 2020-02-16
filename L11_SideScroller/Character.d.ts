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
        grounded: boolean;
        private currentWeapon;
        private lastFrameTime;
        private activeActions;
        private framesSinceLock;
        private lockedInAnimation;
        private animationFPS;
        constructor(_name?: string);
        static generateSprites(_txtImage: f.TextureImage): void;
        swapWeapon(): void;
        show(_action: ACTION): void;
        act(_action: ACTION, _direction?: DIRECTION): void;
        private update;
        getRectWorld(): f.Rectangle;
        releaseAnimationLock: () => void;
        private checkCollision;
    }
}
