import XYZ from "../classes/XYZ.js";
export const pads_width = 10;
export const pad_geom = new XYZ(pads_width, 1, 1);
export const ball_geom = new XYZ(0.75, 10, 10);
export const pad1_z = -40;
export const pad2_z = 40;
export const table_geom = new XYZ(40, 1, 80);
export const ball_start_dir = new XYZ(0, 0, 0.5);
export const clock = new THREE.Clock();