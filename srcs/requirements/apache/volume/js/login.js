(function() 
{
    form = document.getElementById('loginForm');
    document.addEventListener('submit', async (event) => {
        if (event.target.id === 'loginForm') {
            event.preventDefault();
            const data = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
            };
            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.textContent = '';
        }
        try {
            const response = await fetch('http://localhost:8000/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = await response.json();
                const successMessage = document.getElementById('success-message')
                successMessage.textContent = 'Registration successful'
                console.log('Registration successful', result);
            } else {
                const errorData = await response.json();

                const firstErrorField = Object.keys(errorData)[0];
                const firstErrorMessage = errorData[firstErrorField][0];

                errorMessageDiv.textContent = `${firstErrorMessage}`;
                console.error('Erreur d\'inscription:', errorData);
            }
        } catch (error) {
            console.error('Erreur de réseau:', error);
        }
    });
})