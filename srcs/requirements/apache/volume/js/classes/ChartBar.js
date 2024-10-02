export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
		this.data_yx = data_yx;
		this.html_container = html_container;
	}

	generateBars() 
	{
		this.data_yx.forEach(y => 
		{
			var newBar = document.createElement("div");
			newBar.style.backgroundColor = ' blue' ;
			newBar.style.height = '100%';
			newBar.style.widht = '1Opx';
			newBar.style.position = '1Opx';

			this.html_container.appendChild(newBar);  
		});
		// for (const [y, x] of Object.entries(object1))
		// {
		//     var newBar = document.createElement("div");
		//     this.html_container.appendChild(newBar);
		// }
	}

	generateAxes()
	{
		
	}
};