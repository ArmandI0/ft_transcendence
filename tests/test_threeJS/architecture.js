/* document.addEventListener("DOMContentLoaded", function() {
	function loadHTML(containerId, url) {
		fetch(url)
			.then(response => response.text())
			.then(data => {
				document.getElementById(containerId).innerHTML = data;
			})
			.catch(error => console.error('Error loading HTML:', error));
	}

	loadHTML('threejs-container', 'threejs-container.html');
}); */

showSection('game-container-2d');

function showSection(sectionId)
{
	document.querySelectorAll('.game-window').forEach(section => {
		section.style.display = 'none';
	});
	document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('button_to_2d').addEventListener('click', function() 
{
	showSection('game-container-2d');
});

document.getElementById('button_to_3d').addEventListener('click', function() 
{
	showSection('threejs-container');
});

