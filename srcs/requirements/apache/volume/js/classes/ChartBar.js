export default class ChartBar 
{
	constructor(data_yx, html_container)
	{
	  this.data_yx = data_yx;
      this.html_container = html_container;
	}
  
	generateBars() 
	{
        for (const [y, x] of Object.entries(object1))
        {
            var newBar = document.createElement("div");
            this.html_container.appendChild(newBar);
        }
	}
  
    generateAxes()
    {
        
    }
};