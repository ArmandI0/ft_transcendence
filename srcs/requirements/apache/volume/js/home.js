
document.getElementById('button_to_42api').addEventListener('click', async function() 
{
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e7eec0078c1ebf1f2c748a722b939725a58fb11846625ae5893e337c098104f7&redirect_uri=http%3A%2F%2Flocalhost%3A8070&response_type=code';
});	

function handleCode(code) 
{
    const url = `/accounts/api42?code=${code}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Réponse du backend:', data);
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
}

const urlParams = new URLSearchParams(window.location.search);

function updateUrlWindow(newUrl) 
{
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

if (urlParams.has('code')) 
{
    const code = urlParams.get('code');
    handleCode(code);
    const url = window.location.origin + window.location.pathname;
    updateUrlWindow(url);
}
