const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const {WebSocketServer} = require('ws');
const setupWebSocketHandlers = require('./websocketHandlers');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({
        exposedHeaders: ['Authorization'],
        origin: '*'
    }
));
app.use(cookieParser());

const indexRouter = require('./back/route/index');
app.use('', indexRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({server});
setupWebSocketHandlers(wss);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: http://localhost:${PORT}/`);
});
