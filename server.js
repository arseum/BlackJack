const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
const gameRouter = require('./back/route/games');


app.use('', indexRouter);
app.use('/game', gameRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: http://localhost:${PORT}/`);
});
