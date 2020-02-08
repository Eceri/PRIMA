declare namespace L10_FudgeCraft_Combos {
    class Combos {
        found: GridElement[][];
        constructor(_elements: GridElement[]);
        private detect;
        private contains;
        private recurse;
        private findNeigborsOfSameColor;
    }
}
