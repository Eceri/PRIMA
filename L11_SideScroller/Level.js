"use strict";
var L11_SideScroller;
(function (L11_SideScroller) {
    var f = FudgeCore;
    //Describe Levels with these:
    let FLOORTYPE;
    (function (FLOORTYPE) {
        FLOORTYPE["RECT"] = "Rectangle";
        FLOORTYPE["THINRECT"] = "ThinRectangle";
    })(FLOORTYPE || (FLOORTYPE = {}));
    class Level extends f.Node {
        /**
         * create a new Level from the data in Levels.json.
         * @param _id Id of the level. Starts at 1.
         */
        constructor(_id) {
            super("Level");
            let spriteTexture = new f.TextureImage();
            // this.generateSprites(spriteTexture);
            let levelObject = Level.levelsJSON[_id - 1];
            this.generateFloorTiles(levelObject.floorDescription);
        }
        generateFloorTiles(floorDescriptions) {
            floorDescriptions.forEach((floorDesc) => {
                let floor;
                //set position
                let position = new f.Vector3(floorDesc.position.x, floorDesc.position.y);
                //select correct floor type.
                if (floorDesc.moving) {
                    let speed = new f.Vector3();
                    speed.x = floorDesc.speed.x ? floorDesc.speed.x : 1;
                    speed.y = floorDesc.speed.y ? floorDesc.speed.y : 0;
                    floor = new L11_SideScroller.MovingFloor(position, speed);
                }
                else {
                    floor = new L11_SideScroller.Floor(position);
                }
                //set correct floor height; could be a switch-case with more types.
                if (floorDesc.type == FLOORTYPE.THINRECT) {
                    floor.cmpTransform.local.scaleY(0.2);
                }
                else if (floorDesc.type == FLOORTYPE.RECT) {
                    //nothing as of yet.
                }
                //set correct length
                floor.cmpTransform.local.scaleX(floorDesc.length);
                this.appendChild(floor);
            });
        }
        static generateSprites(_txtImage) { }
    }
    L11_SideScroller.Level = Level;
})(L11_SideScroller || (L11_SideScroller = {}));
//# sourceMappingURL=Level.js.map