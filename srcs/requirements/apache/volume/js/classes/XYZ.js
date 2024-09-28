export default class XYZ 
{
	constructor(x, y, z)
	{
	  this.x = x;
	  this.y = y;
	  this.z = z;
	}
  
	displayInfo() 
	{
	  console.log(`x: ${this.x}, y: ${this.y}, z: ${this.z}`);
	}
  
	setX(new_x) 
	{
	  this.x = new_x;
	}
	setY(new_y) 
	{
	  this.y = new_y;
	}
	setZ(new_z) 
	{
	  this.z = new_z;
	}
	getX() 
	{
	  return this.x;
	}
	getY() 
	{
	  return this.y;
	}
	getZ() 
	{
	  return this.z;
	}	
};