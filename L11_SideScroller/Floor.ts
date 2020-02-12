namespace L11_SideScroller {
  import f = FudgeCore;

  export class Floor extends f.Node {
    private static mesh: f.MeshSprite = new f.MeshSprite();
    private static material: f.Material = new f.Material("Floor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("red", 0.5)));
    private static readonly pivot: f.Matrix4x4 = f.Matrix4x4.TRANSLATION(f.Vector3.Y(-0.5));

    public constructor() {
      super("Floor");
      this.addComponent(new f.ComponentTransform());
      this.addComponent(new f.ComponentMaterial(Floor.material));
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(Floor.mesh);
      //cmpMesh.pivot.translateY(-0.5);
      cmpMesh.pivot = Floor.pivot;
      this.addComponent(cmpMesh);
    }

    public getRectWorld(): f.Rectangle {
      let rect: f.Rectangle = f.Rectangle.GET(0, 0, 100, 100);
      let topleft: f.Vector3 = new f.Vector3(-0.5, 0.5, 0);
      let bottomright: f.Vector3 = new f.Vector3(0.5, -0.5, 0);
      
      //let pivot: ƒ.Matrix4x4 = this.getComponent(ƒ.ComponentMesh).pivot;
      let mtxResult: f.Matrix4x4 = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
      topleft.transform(mtxResult, true);
      bottomright.transform(mtxResult, true);

      let size: f.Vector2 = new f.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
      rect.position = topleft.toVector2();
      rect.size = size;

      return rect;
    }
  }
}