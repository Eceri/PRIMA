declare namespace L11_SideScroller {
    import f = FudgeCore;
    class SpriteFrame {
        rectTexture: f.Rectangle;
        pivot: f.Matrix4x4;
        material: f.Material;
        timeScale: number;
    }
    class Sprite {
        private static mesh;
        frames: SpriteFrame[];
        name: string;
        constructor(_name: string);
        static getMesh(): f.MeshSprite;
        /**
         * Creates a series of frames for this [[Sprite]] resulting in pivot matrices and materials to use on a sprite node
         * @param _texture The spritesheet
         * @param _rects A series of rectangles in pixel coordinates defining the single sprites on the sheet
         * @param _resolutionQuad The desired number of pixels within a length of 1 of the sprite quad
         * @param _origin The location of the origin of the sprite quad
         */
        generate(_texture: f.TextureImage, _rects: f.Rectangle[], _resolutionQuad: number, _origin: f.ORIGIN2D): void;
        generateByGrid(_texture: f.TextureImage, _startRect: f.Rectangle, _frames: number, _borderSize: f.Vector2, _resolutionQuad: number, _origin: f.ORIGIN2D): void;
        private createFrame;
    }
    class NodeSprite extends f.Node {
        protected cmpMesh: f.ComponentMesh;
        private cmpMaterial;
        private sprite;
        private frameCurrent;
        private direction;
        constructor(_name: string, _sprite: Sprite);
        showFrame(_index: number): void;
        showFrameNext(): void;
        setFrameDirection(_direction: number): void;
        getRectWorld(): f.Rectangle;
    }
}
