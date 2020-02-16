declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Projectile extends CollidableObject {
        private sprite;
        private speed;
        constructor(_name: string, _sprites: Sprite, _playerPosition: f.Vector3, _direction: DIRECTION, _speed?: f.Vector3);
        private update;
        private checkCollision;
    }
}
