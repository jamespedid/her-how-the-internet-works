const express = require('express');
const morgan = require('morgan');
const path = require('path');

const MagicEightballServerPort = 8888;

function initializeServer(){
    const app = express();
    app.use('/', express.static(path.join(__dirname, 'workarea')));
    app.listen(MagicEightballServerPort, () => {
        console.log(`Magic eightball webserver listening on port ${MagicEightballServerPort}`);
    });
}

initializeServer();