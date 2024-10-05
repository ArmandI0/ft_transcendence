import ChartBar from "./classes/ChartBar.js";
import ChartPie from "./classes/ChartPie.js";

function createTitle(title, div_parent)
{
	var title_div = document.createElement("h2");
	title_div.innerHTML=title;
	div_parent.appendChild(title_div);
}

export function generateChart(div_id, data, type, title)
{
	var chart;
	var div_chart = document.getElementById(div_id);
	createTitle(title, div_chart);

	var chart_body = document.createElement("div");
	chart_body.classList.add('chart_body')
	div_chart.appendChild(chart_body);

	if (type === 'bars')
		chart = new ChartBar(data, chart_body);
	else if (type === 'pie')
		chart = new ChartPie(data, chart_body);
	chart.generate();
}

