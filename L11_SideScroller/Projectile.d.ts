declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Projectile extends CollidableObject {
        private sprite;
        private originPoint;
        private travelDistance;
        private speed;
        private direction;
        constructor(_name: string, _sprites: Sprite, _playerPosition: f.Vector3, _direction: DIRECTION, _speed?: f.Vector3, _travelDistance?: f.Vector2);
        private update;
        private checkCollision;
    }
}
