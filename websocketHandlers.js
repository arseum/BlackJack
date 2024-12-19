module.exports = (wss) => {
    wss.on('connection', (ws) => {
        console.log('Nouveau client connecté.');

        ws.send(JSON.stringify({ message: 'Bienvenue sur le serveur WebSocket!' }));

        ws.on('message', (message) => {
            console.log('Message reçu:', message);

            try {
                const data = JSON.parse(message);

                if (data.type === 'updateCounter') {
                    console.log(`Mise à jour du compteur pour ${data.userId}: ${data.counter}`);

                    wss.clients.forEach((client) => {
                        if (client.readyState === ws.OPEN) {
                            client.send(JSON.stringify({
                                userId: data.userId,
                                counter: data.counter,
                            }));
                        }
                    });
                }
            } catch (error) {
                console.error('Erreur de traitement du message:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client déconnecté.');
        });
    });
};