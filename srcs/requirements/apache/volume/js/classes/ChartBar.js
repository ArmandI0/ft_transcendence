export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
		this.data_yx = data_yx;
		this.html_container = html_container;
		this.y_max = data_yx.reduce((max, obj) => obj.y > max ? obj.y : max, data_yx[0].y);
	}

	generateBars() 
	{
		console.log(this.y_max);
		this.data_yx.forEach(obj => 
		{
			console.log(obj.y);
			var newBar = document.createElement("div");
			const prct = 100 * obj.y / this.y_max;
			newBar.style.backgroundColor = ' blue' ;
			newBar.style.height = `${prct}%`;
			newBar.style.width = '10px';
			newBar.style.marginRight = '10px';
			newBar.style.display = 'inline-block';
			newBar.classList.add('bar');
			this.html_container.appendChild(newBar);  
		});
	}

	generateAxes()
	{
		
	}
};