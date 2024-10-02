import ChartBar from "./classes/ChartBar.js";

const data = [
    { y: 3, x:1 },
    { y: 4, x:1 },
    { y: 5, x:1 },
    { y: 10, x:1 },
    { y: 2, x:1 }
];

const div_chart1 = document.getElementById('bars-score-by-game');
const chart1 = new ChartBar(data,div_chart1);
chart1.generateBars();