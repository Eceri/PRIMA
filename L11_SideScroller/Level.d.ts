declare namespace L11_SideScroller {
    import f = FudgeCore;
    class Level extends f.Node {
        static levelsJSON: [];
        /**
         * create a new Level from the data in Levels.json.
         * @param _id Id of the level. Starts at 1.
         */
        constructor(_id: number);
    }
}
