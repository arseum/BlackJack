async function fetchGames() {
    //game joignable
    const response = await fetch('/api/games/', {
        method: 'GET',
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

    //game active
    const response1 = await fetch('/api/games/active', {
        method: 'GET',
    });

    if (!response1.ok) {
        console.error('Erreur lors de la récupération des jeux actif');
        console.log(response);
        return;
    }

    const data2 = await response1.json();
    const gamesEnCours = document.getElementById('games-en-cours');
    gamesEnCours.innerHTML = '';

    data2.games.forEach(game => {
        let item = document.createElement('li');
        item.textContent = `Table: ${game.table_name}`;

        const openButton = document.createElement('button');
        openButton.textContent = 'Ouvrir';
        openButton.onclick = () => console.log("todo");

        item.appendChild(openButton);
        gamesEnCours.appendChild(item);
    });
}

async function joinGame(gameId) {
    const response = await fetch(`/api/games/${gameId}/join`, {
        method: 'GET',
    });

    const data = await response.json();
    if (response.ok) {
        alert(`Vous avez rejoint le jeu ${gameId}`);
        await fetchGames();
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