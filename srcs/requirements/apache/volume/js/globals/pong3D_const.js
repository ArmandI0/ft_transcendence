import XYZ from "../classes/XYZ.js";
export const padsWidth = 10;
export const padGeom = new XYZ(padsWidth, 1, 1);
export const ballGeom = new XYZ(0.75, 10, 10);
export const pad1Z = -40;
export const pad2Z = 40;
export const tableGeom = new XYZ(40, 1, 80);
export const ballStartDir = new XYZ(0, 0, 0.5);

export const scoreToWin = 3;