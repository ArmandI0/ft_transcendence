import { drawPieSlice } from "../utils/utils_charts.js";
import { drawLine } from "../utils/utils_charts.js";

export default class ChartPie
{
	constructor(options)
	{
		this.options = options;
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.colors = options.colors;
		this.title_options = options.title_options;
		this.data = options.datas;
		this.total_value = this.data.length;
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.radius = 0;
		this.won_games_count = this.data.filter(item => item.won === true).length;
	}

	drawLabel(color, currentWidth, currentHeight, currentRadius, angleSize, anglePos,labelText) 
	{
		var labelX = currentWidth / 2 +
			(currentRadius / 2) * Math.cos(anglePos + angleSize / 2);
		var labelY = currentHeight / 2 +
			(currentRadius / 2) * Math.sin(anglePos + angleSize / 2);
		this.ctx.fillStyle = color;
		const fontSize = currentHeight / 20;
		this.ctx.font = `${fontSize}px Khand`;
		this.ctx.fillText(labelText + "%", labelX, labelY);
	}

	generate()
	{
		this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2) - this.options.padding;
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;			
		const slice_angle_won = (Math.PI * 2) * this.won_games_count / this.total_value;
		drawPieSlice(
			this.ctx,
			this.canvas.width / 2,
			this.canvas.height / 2,
			this.radius,
			0,
			slice_angle_won,
			this.colors[0],
			this.colors[2],
			3
		);
		drawPieSlice(
			this.ctx,
			this.canvas.width / 2,
			this.canvas.height / 2,
			this.radius,
			slice_angle_won,
			2 * Math.PI,
			this.colors[1],
			this.colors[2],
			3
		);
		var labelText = (this.won_games_count / this.total_value * 100).toFixed(2);
		this.drawLabel("#000", this.canvas.width, this.canvas.height, this.radius, slice_angle_won, 0, labelText);
		labelText = 100 - labelText;
		this.drawLabel("#000", this.canvas.width, this.canvas.height, this.radius, 2 * Math.PI - slice_angle_won, slice_angle_won,labelText);
	}
};



		// const ratio = 1 / 3 * 100;
		// var div_chart_pie = document.createElement("div");
		// div_chart_pie.setAttribute('id', 'pie-chart');
		
		// div_chart_pie.style.background = `conic-gradient(
		// #2196f3 0% ${ratio}%, 
		// #f44336 ${ratio}% 100% 
		// )`;
		
		// this.html_container.appendChild(div_chart_pie);