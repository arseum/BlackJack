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