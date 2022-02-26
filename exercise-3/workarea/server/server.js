const express = require('express');
const morgan = require('morgan');
const path = require('path');

const MagicEightballServerPort = 8888;

function initializeServer(){
    const app = express();
    app.use(morgan('dev'));
    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.redirect('/eightball.html');
            return;
        }
        next();
    })
    app.use('/', express.static(path.join(__dirname, '..', 'client')));

    app.listen(MagicEightballServerPort, () => {
        console.log(`Magic eightball webserver listening on port ${MagicEightballServerPort}`);
    });
}

initializeServer();