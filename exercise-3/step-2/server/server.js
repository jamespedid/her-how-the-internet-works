const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const MagicEightballServerPort = 8888;

function initializeServer(){
    const app = express();
    app.use(morgan('dev'));
    app.use('/api/eightball',
        bodyParser.text(),
        (req, res) => {
            const input = req.body;
            const response = chooseEightballResponse(input);

            setTimeout(() => {
                res.status(200);
                res.send(response);
                res.end();
            }, 2000);
        }
    )
    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.redirect('/eightball.html');
            return;
        }
        next();
    })
    app.use(express.static(path.join(__dirname, '..', 'client')));

    app.listen(MagicEightballServerPort, () => {
        console.log(`Magic eightball webserver listening on port ${MagicEightballServerPort}`);
    });
}

const EightBallResponses = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
];
const EightBallRandomThreshold = 0.25;

function chooseEightballResponse(input) {
    if (shouldReplyWithRandomResponse()) {
        return chooseRandomReply();
    }
    return chooseReplyFromInputHash(input);
}

function shouldReplyWithRandomResponse() {
    return Math.random() < EightBallRandomThreshold;
}

function chooseRandomReply() {
    const replyIndex = Math.floor(Math.random() * EightBallResponses.length);
    return EightBallResponses[replyIndex];
}

function chooseReplyFromInputHash(input) {
    let replyIndex = 0;
    for (let i = 0; i < input.length; i += 1) {
        replyIndex += input.charCodeAt(i);
    }
    let indexRemainder = replyIndex % EightBallResponses.length;
    return EightBallResponses[indexRemainder];
}

initializeServer();