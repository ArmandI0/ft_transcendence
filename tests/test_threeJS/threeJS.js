function makeObjectInstance(geometryType, x, y, z, color, pos_z, scene) 
{
	let geometry;
	switch(geometryType)
	{
		case "sphere":
			geometry = new THREE.SphereGeometry(x,y,z);
			break;
		case "box":
			geometry = new THREE.BoxGeometry(x,y,z);
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
		clearCoat: 1.0,           // Effet de couche de finition, simule l'éclat du verre
		clearCoatRoughness: 0.1,  // La rugosité de la couche de finition, réduit pour un effet plus lisse
		metalness: 0.1,           // Réduit la métallisation pour simuler un effet de verre non métallique
		roughness: 0.1,           // Réduit la rugosité pour un effet de surface lisse
		transmission: 0.5,        // Le niveau de transmission de la lumière, 1.0 pour un matériau complètement transparent
		opacity: 0.5,             // Opacité totale du matériau, 1.0 pour totalement opaque
		transparent: true         // Le matériau doit être transparent
	});
	
	const geometry = new THREE.BoxGeometry(40,1,80);
	const table = new THREE.Mesh(geometry, glassMaterial);
	const edges = new THREE.EdgesGeometry(geometry); 
	const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 	
	scene.add(table);	
	scene.add(lines);
	table.position.y = -1;
	lines.position.y = -1;	
	return table;
}

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

// Adding objects
const pad1 = makeObjectInstance("box", 10,1,1,0xff0000,-40, scene1);
const pad2 = makeObjectInstance("box", 10,1,1,0x0000ff,40, scene1);
const ball = makeObjectInstance("sphere", 1,16,16,0xffffff,0, scene1);
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

	renderer1.render(scene1, camera1);
	renderer2.render(scene1, camera2);
}
animate();
