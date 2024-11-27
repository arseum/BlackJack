document.addEventListener("DOMContentLoaded", function() {
    const flipCard = document.querySelector('.flip-card');
    const openSignUp = document.getElementById('openSignUp');
    const openSignIn = document.getElementById('openSignIn');
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');

    if (flipCard && openSignUp && openSignIn) {
        openSignUp.addEventListener('click', function() {
            flipCard.classList.add('flipped');
        });

        openSignIn.addEventListener('click', function() {
            flipCard.classList.remove('flipped');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);   
            const data = {
                email: formData.get('email'),
                mdp: formData.get('mdp')
            };

            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.message === 'Connexion réussie') {
                    window.location.href = '/accueil';
                } else {
                    alert('Email ou mot de passe incorrect');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(signUpForm);
            const data = {
                prenom: formData.get('prenom'),
                email: formData.get('email'),
                mdp: formData.get('mdp')
            };

            fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});
