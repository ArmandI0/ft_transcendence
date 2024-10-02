import ChartBar from "./classes/ChartBar.js";

const data = [
    { y: 3, x:1 },
    { y: 4, x:1 },
    { y: 5, x:1 },
    { y: 10, x:1 },
    { y: 2, x:1 }
];

function createTitle(title, div_parent)
{
    var title_div = document.createElement("h2");
    title_div.innerHTML=title;
    div_parent.appendChild(title_div);
}

function generateChart(div_id)
{
    var div_chart1 = document.getElementById(div_id);
    createTitle("TITRE1", div_chart1);

    var chart_body = document.createElement("div");
    chart_body.classList.add('chart_body')
    div_chart1.appendChild(chart_body);

    const chart1 = new ChartBar(data, chart_body);
    chart1.generate();
}

generateChart('bars-score-by-game');