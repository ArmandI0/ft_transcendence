import { generateCharts } from "../charts.js";
import { setBordersAvatarDefault } from "./avatars.js";
import { resetGlobalsVar } from "./gameStatus.js";

export async function launchFunctions(page)
{
    if (page === 'charts')
		generateCharts();
    if (page === 'pong3D_menu')
        setBordersAvatarDefault();
    if (page === 'home')
        resetGlobalsVar();
}
