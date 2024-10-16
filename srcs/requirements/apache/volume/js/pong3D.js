import {padGeom, ballGeom, pad1Z, pad2Z, tableGeom, ballStartDir, scoreToWin} from './globals/pong3D_const.js';
import * as gameStatus from './utils/gameStatus.js' ;
import { iaPlayer, preventKeys } from './utils/pong_ia_3d.js';
import { loadPage } from './htmlRequest.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import  {MTLLoader}  from './utils/MTLLoader.js';
import  {OBJLoader}  from './utils/OBJLoader.js';
import { hideSection, showSection } from './utils/showAndHideSections.js';
// import {setPongData} from './utils/utils_database.js';
import {SendDataPong} from './utils/SendDataHandle.js';

const clockPause = new THREE.Clock();
export const clockIA = new THREE.Clock();

// async function putScoreToDb(score, startTime)
// {
// 	SendDataPong(score[0], score[1], -1, "Cyberpong", startTime)
// }

function makeObjectInstance(geomType, geom, color, pos_z) 
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
	
	const geometry = new THREE.BoxGeometry(tableGeom.getX(), tableGeom.getY(), tableGeom.getZ());
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
    const max_height_offset = (tableGeom.getZ() ** 2) / 4 / coefficient;

    let calculated_y_position = (ball_pos_z ** 2) / coefficient - max_height_offset;

    return Math.max(calculated_y_position, 0);
}

function checkCollisionPad(ball, pad1, pad2)
{
	const pad1_right = pad1.position.x - padGeom.getX()/2; 
	const pad1_left = pad1.position.x + padGeom.getX()/2; 
	const pad2_right = pad2.position.x - padGeom.getX()/2; 
	const pad2_left = pad2.position.x + padGeom.getX()/2;
	const ball_right = ball.position.x - ballGeom.getX();
	const ball_left = ball.position.x + ballGeom.getX();

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

function pong3DUpdateBallPosition(ball, ball_dir, pad1, pad2, gridCollision, pause, score)
{
	gridCollision.visible = false;
	ball.position.x += ball_dir.getX();
	ball.position.z += ball_dir.getZ();
	ball.position.y = calculateYposition(ball.position.z);
	const offset = 6;
	let col_z = 0;

	// check if wall hit
	if (Math.abs(ball.position.x) >= tableGeom.getX() / 2 - ballGeom.getX())
	{
		ball_dir.setX(-(ball_dir.getX()));
		gridCollision.position.y = ball.position.y;
		gridCollision.position.z = ball.position.z;
		if (ball.position.x > 0)
			gridCollision.position.x = tableGeom.getX() / 2;
		else if (ball.position.x <= 0)
			gridCollision.position.x = - tableGeom.getX() / 2;
		gridCollision.visible = true;
	}

	// check if pad hit or ball out
	if (Math.abs(ball.position.z) >= tableGeom.getZ() / 2 - padGeom.getZ() / 1.5)
	{
		col_z = checkCollisionPad(ball, pad1, pad2);

		// reset if out
		if (col_z === -1000)
		{
			if (ball.position.z < 0)
				score[0] += 1;
			else
				score[1] += 1;
			updateScore(score);
			ball.position.z = 0;
			ball.position.x = 0;
			ball.position.y = calculateYposition(ball.position.z);
			ball_dir.setX(0);
			pause = true;
			clockPause.start();
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

function isGameWon(score)
{
	if (score[0] >= scoreToWin || score[1] >= scoreToWin)
		return true;
	else
		return false;
}

function updateScore(score)
{
	const divScore = document.querySelector('#score-pong3d p');
	const text = `${score[0]} - ${score[1]}`;
	divScore.innerHTML = text;
}

function loadAvatar(type, zDist, color) 
{
	var scale = 0.005;
	var path = "";
	if (type === 1)
		path = "./obj3d/Deathstroke-obj"
	else if (type === 2)
		path = "./obj3d/Borderlands cosplay-obj"
	else if (type === 3)
		path = "./obj3d/Harley Quinn"

	return new Promise((resolve, reject) => {
		console.log(`le type est : ${type}`);
		if (type != 0) {
			const mtlLoader = new MTLLoader();
			mtlLoader.load(path + '.mtl', function (materials) {
				materials.preload();
				const objLoader = new OBJLoader();
				objLoader.setMaterials(materials);

				objLoader.load(path + '.obj', function (pad) {
					pad.name = "pad";
					pad.traverse(function (child) {
						if (child.isMesh) 
						{
							child.material.transparent = true;
							child.material.opacity = 0.75;
						}
					});
					if (path != './obj3d/Harley Quinn')
					{
						pad.rotation.x -= Math.PI / 2; 
						if (zDist > 0)
							pad.rotation.z -= Math.PI; 
					}
					else 
					{
						pad.position.y += 5;
						if (zDist > 0)
							pad.rotation.y -= Math.PI; 
					}
					pad.position.z = zDist;
					pad.scale.set(scale,scale,scale);

					resolve(pad);
				}, undefined, function (error) {
					reject(error);
				});
			}, undefined, function (error) {
				reject(error);
			});
		}
		else 
		{
			const pad = makeObjectInstance("box", padGeom, color, zDist);
			resolve(pad);
		}
	});
}

export async function  startGame3D()
{
	showSection('loading-screen');
    gameStatus.setStatus('game_run', true);
	let pause = false;
	let score = [0,0];
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

	let ball_dir = ballStartDir;

	// Adding objects
	const pad1 = await loadAvatar(gameStatus.getAvatarType(1), pad1Z, 0xFF0000);
	const pad2 = await loadAvatar(gameStatus.getAvatarType(2), pad2Z, 0x0000FF);
	
	const ball = makeObjectInstance("sphere", ballGeom,0xffffff,0, scene);
	const table = makeTable(scene);
	const geom = new THREE.BoxGeometry(padGeom.getX(), padGeom.getY(), padGeom.getZ());
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
	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(50, 50, 0);
	scene.add(light);

	// const spotLight = new THREE.SpotLight(color);
	// spotLight.position.set(0, 10, 0);
	// spotLight.angle = Math.PI / 6;
	// spotLight.penumbra = 0.1;
	// spotLight.target = table;
	// scene.add(spotLight);

	camera1.position.z = -52;
	camera1.position.y = 15;
	camera2.position.z = 52;
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

	clockPause.start();
	if (gameStatus.getStatus('ia') === true)
		clockIA.start();
		
	scene.add(pad1);
	scene.add(pad2);
	scene.add(ball);
	hideSection('loading-screen');
	let startTime = Date.now();
	function pong3DAnimate() 
	{
		if (gameStatus.getStatus('game_run') === false)
		{
			console.log("game interrupted");
			return;
		}
		if (isGameWon(score))
		{
			console.log("game finished");
			SendDataPong(score[0], score[1], -1, "Cyberpong", startTime)
			loadPage('pong3D_menu', 'app');
			return;
		}
		
		requestAnimationFrame(pong3DAnimate);
		if(!pause)
			[ball_dir, pause] = pong3DUpdateBallPosition(ball, ball_dir, pad1, pad2, gridCollision, pause, score);
		else if(clockPause.getElapsedTime() > 1.5)
			pause = false;
		
		linesEdgesPad1.position.x = pad1.position.x;
		linesEdgesPad2.position.x = pad2.position.x;

		if (keysPressed['ArrowLeft']) {
			pad2.position.x -= 0.75; 
		}
		if (keysPressed['ArrowRight']) {
			pad2.position.x += 0.75;
		}
		if (keysPressed['KeyA']) {
			pad1.position.x += 0.75;
		}
		if (keysPressed['KeyD']) {
			pad1.position.x -= 0.75;
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



