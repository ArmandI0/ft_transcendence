document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('clickable');
    const image = document.getElementById('hiddenImage');

    button.addEventListener('click', () => {
        image.style.display = 'block';
    });
});