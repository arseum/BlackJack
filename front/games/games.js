async function fetchGames() {
    const response = await fetch('/api/games/', {
        method: 'GET',
        // headers: {
        //     'Authorization': 'Bearer ' + localStorage.getItem('access_token') // Assurez-vous que le token est dans le localStorage
        // }
    });

    if (!response.ok) {
        console.error('Erreur lors de la récupération des jeux');
        console.log(response);
        return;
    }

    const data = await response.json();
    const gamesList = document.getElementById('games');
    gamesList.innerHTML = '';

    data.games.forEach(game => {
        const gameItem = document.createElement('li');
        gameItem.textContent = `Table: ${game.table_name}, Max Players: ${game.max_players}`;

        const joinButton = document.createElement('button');
        joinButton.textContent = 'Rejoindre';
        joinButton.onclick = () => joinGame(game.game_id);

        gameItem.appendChild(joinButton);
        gamesList.appendChild(gameItem);
    });
}

async function joinGame(gameId) {
    const response = await fetch(`/api/games/${gameId}/join`, {
        method: 'GET',
        // headers: {
        //     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        // }
    });

    const data = await response.json();
    if (response.ok) {
        alert(`Vous avez rejoint le jeu ${gameId}`);
        fetchGames();
    } else {
        alert(data.error || 'Erreur lors de l\'ajout au jeu');
    }
}

document.getElementById('create-game-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tableName = document.getElementById('tableName').value;
    const maxPlayers = document.getElementById('maxPlayers').value;

    const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify({ tableName, maxPlayers })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        fetchGames();
    } else {
        alert(data.error || 'Erreur lors de la création du jeu');
    }
});

fetchGames();