export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
		this.data_yx = data_yx;
		this.html_container = html_container;
		this.y_max = data_yx.reduce((max, obj) => obj.y > max ? obj.y : max, data_yx[0].y);
		this.nb_obj = data_yx.length;
	}

	generate()
	{
		const ratio = 1 / 3 * 100;
		var div_chart_pie = document.createElement("div");
		div_chart_pie.setAttribute('id', 'pie-chart');
		
		div_chart_pie.style.background = `conic-gradient(
		#2196f3 0% ${ratio}%, 
		#f44336 ${ratio}% 100% 
		)`;
		
		this.html_container.appendChild(div_chart_pie);
	}
};