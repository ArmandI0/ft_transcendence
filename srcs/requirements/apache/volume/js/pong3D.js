function showSectionPong(sectionId)
{
	document.getElementById(sectionId).style.display = 'flex';
}

function hideSectionPong(sectionId) 
{
    document.getElementById(sectionId).style.display = 'none';
}

document.getElementById('button-start-pong-3D').addEventListener('click', function() 
{
    hideSectionPong('button-start-pong-3D');
    startGame3D();
});

class XYZ 
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
}

// constants declaration
const pads_width = 10;
const pad_geom = new XYZ(pads_width, 1, 1);
const ball_geom = new XYZ(0.75, 10, 10);
const pad1_z = -40;
const pad2_z = 40;
const table_geom = new XYZ(40, 1, 80);
const ball_start_dir = new XYZ(0, 0, 0.5);

function makeObjectInstance(geomType, geom, color, pos_z, scene) 
{
	let geometry;
	switch (geomType)
	{
		case "box":
			geometry = new THREE.BoxGeometry(geom.getX(), geom.getY(), geom.getZ());
			break;
		case "sphere":
			geometry = new THREE.SphereGeometry(geom.getX(), geom.getY(), geom.getZ());
			break;
	}
    const material = new THREE.MeshPhongMaterial(
	{
        color: color,
        emissive: color
    });

	const obj = new THREE.Mesh(geometry, material);
	obj.position.z = pos_z;
	scene.add(obj);
	return obj;	
}

function makeTable(scene)
{
	const glassMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,          // Couleur de base du matériau
		clearcoat: 1.0,           // Effet de couche de finition, simule l'éclat du verre
		clearcoatRoughness: 0.1,  // La rugosité de la couche de finition, réduit pour un effet plus lisse
		metalness: 0.1,           // Réduit la métallisation pour simuler un effet de verre non métallique
		roughness: 0.1,           // Réduit la rugosité pour un effet de surface lisse
		transmission: 0.5,        // Le niveau de transmission de la lumière, 1.0 pour un matériau complètement transparent
		opacity: 0.5,             // Opacité totale du matériau, 1.0 pour totalement opaque
		transparent: true         // Le matériau doit être transparent
	});
	
	const geometry = new THREE.BoxGeometry(table_geom.getX(), table_geom.getY(), table_geom.getZ());
	const table = new THREE.Mesh(geometry, glassMaterial);
	const edges = new THREE.EdgesGeometry(geometry); 
	const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 	
	scene.add(table);	
	scene.add(lines);
	table.position.y = -1;
	lines.position.y = -1;	
	return table;
}

function prepareScene()
{

}

function calculateYposition(ball_pos_z)
{
    const coefficient = -50;
    const max_height_offset = (table_geom.getZ() ** 2) / 4 / coefficient;

    let calculated_y_position = (ball_pos_z ** 2) / coefficient - max_height_offset;

    return Math.max(calculated_y_position, 0);
}

function checkCollisionPad(ball, pad1, pad2)
{
	const pad1_right = pad1.position.x - pad_geom.getX(); 
	const pad1_left = pad1.position.x + pad_geom.getX(); 
	const pad2_right = pad2.position.x - pad_geom.getX(); 
	const pad2_left = pad2.position.x + pad_geom.getX();
	const ball_right = ball.position.x - ball_geom.getX();
	const ball_left = ball.position.x + ball_geom.getX();

	if (ball.position.z < 0)
	{
		if (ball_left < pad1_right || ball_right > pad1_left)
			return -1;
		else
		{
			console.log(ball.position.x - pad1.position.x);
			return (ball.position.x - pad1.position.x);
		}
	}
	else
	{
		if (ball_left < pad2_right || ball_right > pad2_left)
			return -1;
		else
			return (ball.position.x - pad2.position.x);
	}
}

function updateBallPosition(ball, ball_dir, pad1, pad2)
{
	ball.position.x += ball_dir.getX();
	ball.position.z += ball_dir.getZ();
	ball.position.y = calculateYposition(ball.position.z);

	let col_z = 0;

	// check if wall hit
	if (Math.abs(ball.position.x) >= table_geom.getX() / 2)
		ball_dir.setX(-(ball_dir.getX()));

	// check if pad hit or ball out
	if (Math.abs(ball.position.z) >= table_geom.getZ() / 2 - pad_geom.getZ() / 1.5)
	{
		col_z = checkCollisionPad(ball, pad1, pad2);
		ball_dir.setZ(-(ball_dir.getZ()));
		if (ball_dir.getX() > 0)
			ball_dir.setX(Math.abs(col_z));
		else if (ball_dir.getX() === 0)
			ball_dir.setX(col_z);
		else
			ball_dir.setX(-Math.abs(col_z));

	}

	// reset if out
	if (col_z === -1)
		ball.position.z = 0;

	return ball_dir;
}

async function  startGame3D()
{
	const container1 = document.getElementById('view-player1');
	const container2 = document.getElementById('view-player2');

	const width_3d = container1.clientWidth;
	const height_3d = container1.clientHeight;

	const scene1 = new THREE.Scene();
	const camera1 = new THREE.PerspectiveCamera(75, width_3d / height_3d, 0.1, 1000);
	const renderer1 = new THREE.WebGLRenderer();

	const camera2 = new THREE.PerspectiveCamera(75, width_3d / height_3d, 0.1, 1000);
	const renderer2 = new THREE.WebGLRenderer();

	renderer1.setSize(width_3d,height_3d); 
	container1.appendChild(renderer1.domElement);

	renderer2.setSize(width_3d,height_3d);
	container2.appendChild(renderer2.domElement);

	let ball_dir = ball_start_dir;

	// Adding objects
	const pad1 = makeObjectInstance("box", pad_geom,0xff0000,pad1_z, scene1);
	const pad2 = makeObjectInstance("box", pad_geom,0x0000ff,pad2_z, scene1);
	const ball = makeObjectInstance("sphere", ball_geom,0xffffff,0, scene1);
	const table = makeTable(scene1);

	// Adding light
	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(-10, 4, 0);
	scene1.add(light);

	camera1.position.z = 62;
	camera1.position.y = 15;
	camera2.position.z = -62;
	camera2.position.y = 15;

	/* cube1.position.z = 10;
	cube2.position.z = -10; */

	camera1.lookAt(0,0,0);
	camera2.lookAt(0,0,0);

	document.addEventListener('keydown', function(event) 
	{
		switch(event.code) 
		{
			case 'ArrowLeft':
				pad1.position.x += 1;
				break;
			case 'ArrowRight':
				pad1.position.x -= 1;
				break;
			case 'KeyA':
				pad2.position.x -= 1;
				break;
			case 'KeyD':
				pad2.position.x += 1;
				break;			
		}
	});

	function animate() 
	{
		requestAnimationFrame(animate);
		ball_dir = updateBallPosition(ball, ball_dir, pad1, pad2);
		renderer1.render(scene1, camera1);
		renderer2.render(scene1, camera2);
	}
	animate();
}



