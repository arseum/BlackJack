const logoutLink = document.getElementById('logout-link');

logoutLink.addEventListener('click', function (e) {
    e.preventDefault();

    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            }
        })
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // Exemple d'envoi des données à un serveur via fetch
    fetch('https://votre-serveur.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Email envoyé avec succès!');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'envoi de l\'email.');
    });
});
