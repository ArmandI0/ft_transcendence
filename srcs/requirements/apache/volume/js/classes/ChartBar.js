export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
		this.data_yx = data_yx;
		this.html_container = html_container;
		this.y_max = data_yx.reduce((max, obj) => obj.y > max ? obj.y : max, data_yx[0].y);
		this.nb_obj = data_yx.length;
	}

	generateBars() 
	{
		this.data_yx.forEach(obj => 
		{
			console.log(obj.y);
			var newBar = document.createElement("div");
			const prct_height = 100 * obj.y / this.y_max;
			const prct_width = 100 / this.nb_obj;
			newBar.style.height = `${prct_height}%`;
			newBar.style.width = `${prct_width - 5}%`;
			newBar.style.marginLeft = '5%';
			newBar.style.display = 'inline-block';
			newBar.classList.add('bar_chart');
			this.html_container.appendChild(newBar);  
		});
	}

	generateAxes()
	{
		
	}
};