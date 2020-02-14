namespace L11_SideScroller{

  export abstract class CollidableObject extends f.Node{
    protected static readonly pivot: f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.ZERO());

    public constructor(_name: string){
      super(_name);
      
    }

    public getRectWorld(): f.Rectangle {
      let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100, f.ORIGIN2D.TOPRIGHT);
      let topleft: f.Vector3 = new f.Vector3(-0.5, 0.5, 0);
      let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);
      let mtxResult: f.Matrix4x4 = this.mtxWorld
      topleft.transform(mtxResult, true);
      bottomright.transform(mtxResult, true);

      let size: f.Vector2 = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
      rect.position = topleft.toVector2();
      rect.size = size;

      return rect;
    }
  }
}