namespace L11_SideScroller {
  import f = FudgeCore;

  //Describe Levels with these:
  interface Position {
    x: number;
    y: number;
  }
  interface Speed {
    x: number;
    y: undefined | number;
  }
  //needs to be split into interfaces for moving/static floortiles.
  interface FloorDescription {
    type: FLOORTYPE;
    length: number;
    position: Position;
    moving: undefined | boolean;
    speed: undefined | Speed;
    travelDistance: undefined | number;
  }
  interface LevelDescription {
    tileset: string; // sprite sheet file name. Not working.
    background: string[]; //sprite sheet file names.
    floorDescription: Array<FloorDescription>;
  }

  export class Level extends f.Node {
    public static levelsJSON: [];

    /**
     * create a new Level from the data in Levels.json.
     * @param _id Id of the level. Starts at 1.
     */
    constructor(_id: number) {
      super("Level");
      let levelObject: LevelDescription = Level.levelsJSON[_id - 1];
      levelObject.floorDescription.forEach((floorDesc: FloorDescription) => {
        let floor: Floor;
        //set position
        let position: f.Vector3 = new f.Vector3(
          floorDesc.position.x,
          floorDesc.position.y
        );
        //select correct floor type.
        if (floorDesc.moving) {
          let speed: f.Vector3 = new f.Vector3();
          speed.x = floorDesc.speed.x ? floorDesc.speed.x : 1;
          speed.y = floorDesc.speed.y ? floorDesc.speed.y : 0;
          floor = new MovingFloor(position, speed, floorDesc.type);
        } else {
          floor = new Floor(position, floorDesc.type);
        }
        //set correct length
        floor.cmpTransform.local.scaleX(floorDesc.length);

        this.appendChild(floor);
      });
      
    }
  }
}
