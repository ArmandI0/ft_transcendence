import {pads_width, pad_geom, ball_geom, pad1_z, pad2_z, table_geom, ball_start_dir, clock, clockIA} from './globals/pong3D_const.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { iaPlayer, preventKeys } from './utils/pong_ia_3d.js';

async function putScoreToDb()
{
	// const url = '/api/setPongResult/';

	// const data = {
	// 	user : 'user1',
	// 	score: 'score1',
	// }

	// try 
	// {
	// 	const response = await fetch(url, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(data)
	// 	});

	// 	if (!response.ok) {
	// 		throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
	// 	}

	// 	const responseData = await response.json();
	// 	console.log('Réponse du serveur:', responseData);
	// }
	// catch (error) 
	// {
	// 	console.error('Erreur lors de la requête POST:', error);
	// }
}

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
    const material = new THREE.MeshPhysicalMaterial(
	{
        color: color,
        emissive: color,
		roughness:0.0,
		metalness:1.0,
		ior:1.0,
		reflectivity:1.0,
		transparent:true,
		opacity:0.75,
		alphaTest:0.41,
		clearcoat:0.5,
		clearcoatRoughness:0,
    });

	const obj = new THREE.Mesh(geometry, material);
	obj.position.z = pos_z;
	scene.add(obj);
	return obj;	
}

function makeTable(scene)
{
	const glassMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x000000,          
		clearcoat: 1.0,           
		clearcoatRoughness: 0.1,  
		metalness: 0.1,       
		roughness: 0.1,         
		transmission: 0.5,        
		opacity: 0.9,             
		transparent: true        
	});
	
	const geometry = new THREE.BoxGeometry(table_geom.getX(), table_geom.getY(), table_geom.getZ());
	const table = new THREE.Mesh(geometry, glassMaterial);
	const edges = new THREE.EdgesGeometry(geometry); 
	const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xff4afa } ) ); 	
	scene.add(table);	
	scene.add(lines);
	table.position.y = -1;
	lines.position.y = -1;
	return table;
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
	const pad1_right = pad1.position.x - pad_geom.getX()/2; 
	const pad1_left = pad1.position.x + pad_geom.getX()/2; 
	const pad2_right = pad2.position.x - pad_geom.getX()/2; 
	const pad2_left = pad2.position.x + pad_geom.getX()/2;
	const ball_right = ball.position.x - ball_geom.getX();
	const ball_left = ball.position.x + ball_geom.getX();

	if (ball.position.z <= 0)
	{
		if (ball_left < pad1_right || ball_right > pad1_left)
			return -1000;
		else
			return (ball.position.x - pad1.position.x);
	}
	else
	{
		if (ball_left < pad2_right || ball_right > pad2_left)
			return -1000;
		else
			return (ball.position.x - pad2.position.x);
	}
}

function pong3DUpdateBallPosition(ball, ball_dir, pad1, pad2, gridCollision, pause)
{
	gridCollision.visible = false;
	ball.position.x += ball_dir.getX();
	ball.position.z += ball_dir.getZ();
	ball.position.y = calculateYposition(ball.position.z);
	const offset = 6;
	let col_z = 0;

	// check if wall hit
	if (Math.abs(ball.position.x) >= table_geom.getX() / 2 - ball_geom.getX())
	{
		ball_dir.setX(-(ball_dir.getX()));
		gridCollision.position.y = ball.position.y;
		gridCollision.position.z = ball.position.z;
		if (ball.position.x > 0)
			gridCollision.position.x = table_geom.getX() / 2;
		else if (ball.position.x <= 0)
			gridCollision.position.x = - table_geom.getX() / 2;
		gridCollision.visible = true;
	}

	// check if pad hit or ball out
	if (Math.abs(ball.position.z) >= table_geom.getZ() / 2 - pad_geom.getZ() / 1.5)
	{
		col_z = checkCollisionPad(ball, pad1, pad2);

		// reset if out
		if (col_z === -1000)
		{
			ball.position.z = 0;
			ball.position.x = 0;
			ball.position.y = calculateYposition(ball.position.z);
			ball_dir.setX(0);
			pause = true;
			clock.start();
			pad1.position.x = 0;
			pad2.position.x = 0;
		}
		else
		{
			ball_dir.setZ(-(ball_dir.getZ()));
			if (ball_dir.getX() > 0)
				ball_dir.setX(Math.abs(col_z)/offset);
			else if (ball_dir.getX() === 0)
				ball_dir.setX(col_z/offset);
			else
				ball_dir.setX(-Math.abs(col_z)/offset);
		}
	}
	return [ball_dir, pause];
}

function makeEdges(geometry, color)
{
	const edges = new THREE.EdgesGeometry(geometry); 
	const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: color } ) ); 
	return lines;
}

function makeGridCollision(spacing)
{
    const points = [];
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff8e3b });
	const grid = new THREE.Group();

    for (let i = -2; i <= 2; i++) 
	{
        for (let j = -2; j <= 2; j++) 
		{
            const point = new THREE.Vector3(0, i * spacing, j * spacing);
            points.push(point);
        }
    }

    for (let i = 0; i < points.length; i++) 
	{
        const currentPoint = points[i];
        const x = currentPoint.x;
        const y = currentPoint.y;

        if ((i + 1) % 5 !== 0) 
		{
            const nextPointHoriz = points[i + 1];
            const geometry = new THREE.BufferGeometry().setFromPoints([currentPoint, nextPointHoriz]);
            const line = new THREE.Line(geometry, lineMaterial);
			grid.add(line);
        }

        if (i < 20) 
		{
            const nextPointVert = points[i + 5];
            const geometry = new THREE.BufferGeometry().setFromPoints([currentPoint, nextPointVert]);
            const line = new THREE.Line(geometry, lineMaterial);
			grid.add(line);
        }
    }

    return grid;
}

export async function  startGame3D()
{
    gameStatus.setStatus('game_run', true);
	let pause = false;
	const container1 = document.getElementById('view-player1');
	const container2 = document.getElementById('view-player2');

	const width_3d = container1.clientWidth;
	const height_3d = container1.clientHeight;

	const scene = new THREE.Scene();
	const camera1 = new THREE.PerspectiveCamera(75, width_3d / height_3d, 0.1, 1000);
	const renderer1 = new THREE.WebGLRenderer({
		alpha:true,
	});
	
	const camera2 = new THREE.PerspectiveCamera(75, width_3d / height_3d, 0.1, 1000);
	const renderer2 = new THREE.WebGLRenderer({
		alpha:true,
	});

	renderer1.setSize(width_3d,height_3d); 
	container1.appendChild(renderer1.domElement);

	renderer2.setSize(width_3d,height_3d);
	container2.appendChild(renderer2.domElement);

	let ball_dir = ball_start_dir;

	// Adding objects
	const pad1 = makeObjectInstance("box", pad_geom,0xff0000,pad1_z, scene);
	const pad2 = makeObjectInstance("box", pad_geom,0x0000ff,pad2_z, scene);
	const ball = makeObjectInstance("sphere", ball_geom,0xffffff,0, scene);
	const table = makeTable(scene);
	const geom = new THREE.BoxGeometry(pad_geom.getX(), pad_geom.getY(), pad_geom.getZ());
	const linesEdgesPad1 = makeEdges(geom,0x4afff4);
	const linesEdgesPad2 = makeEdges(geom,0xff7fa8);
	linesEdgesPad1.position.z = pad1.position.z;
	linesEdgesPad2.position.z = pad2.position.z;
	scene.add(linesEdgesPad1);
	scene.add(linesEdgesPad2);

	const gridCollision = makeGridCollision(1);
	gridCollision.visible = false;
	scene.add(gridCollision);

	// Adding light
	const color = 0xFFFF00;
	const intensity = 3;
	// const light = new THREE.DirectionalLight(color, intensity);
	// light.position.set(50, 50, 0);
	// scene.add(light);

	const spotLight = new THREE.SpotLight(color);
	spotLight.position.set(0, 10, 0);
	spotLight.angle = Math.PI / 6;
	spotLight.penumbra = 0.1;
	spotLight.target = table;
	scene.add(spotLight);

	camera1.position.z = 62;
	camera1.position.y = 15;
	camera2.position.z = -62;
	camera2.position.y = 15;

	camera1.lookAt(0,0,0);
	camera2.lookAt(0,0,0);

	let keysPressed = {};

	document.addEventListener('keydown', function(event) {
		keysPressed[event.code] = true;
	});
	
	document.addEventListener('keyup', function(event) {
		keysPressed[event.code] = false;
	});

	clock.start();
	if (gameStatus.getStatus('ia') === true)
		clockIA.start();
		// window.addEventListener('popstate', function(event)
		// {
		// 	pong3D_run = false;
		// 	console.log("Le jeu s'arrête.");
		// });
		
	function pong3DAnimate() 
	{
		if (gameStatus.getStatus('game_run') === false)
		{
			console.log("stop");
			putScoreToDb();
			return;		
		}

		requestAnimationFrame(pong3DAnimate);
		if(!pause)
			[ball_dir, pause] = pong3DUpdateBallPosition(ball, ball_dir, pad1, pad2, gridCollision, pause);
		else if(clock.getElapsedTime() > 1.5)
			pause = false;

		linesEdgesPad1.position.x = pad1.position.x;
		linesEdgesPad2.position.x = pad2.position.x;

		// if (gameStatus.getStatus('ia') === true)
		// {
		// 	preventKeys('ArrowLeft');
		// 	preventKeys('ArrowRight');
		// }
		if (keysPressed['ArrowLeft']) {
			pad1.position.x += 0.75; 
		}
		if (keysPressed['ArrowRight']) {
			pad1.position.x -= 0.75;
		}
		if (keysPressed['KeyA']) {
			pad2.position.x -= 0.75;
		}
		if (keysPressed['KeyD']) {
			pad2.position.x += 0.75;
		}

		if (clockIA.getElapsedTime() > 0.5 && gameStatus.getStatus('ia') === true) 
		{
			if (ball_dir.getZ() < 0)
				iaPlayer(ball_dir, ball, pad1,1);
			else
				iaPlayer(ball_dir, ball, pad1,0);
			clockIA.start();
		}

		renderer1.render(scene, camera1);
		renderer2.render(scene, camera2);
	}
	pong3DAnimate();
}



