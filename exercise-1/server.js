const net = require('net');

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
const EightBallServerPort = 8888;

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

function createTcpServer() {
    const server = net.createServer();

    server.on('connection', socket => {
        socket.setEncoding('utf8');

        socket.on('data', data => {
            const output = chooseEightballResponse(data);
            console.log(`replying to ${data} with ${output}`);
            socket.write(output);
        });

        console.log('received a connection to the magic eightball server');
    });

    server.on('listening', () => {
        console.info(`listening for eightball connections on port ${EightBallServerPort}`);
    });

    server.listen(EightBallServerPort);
}

createTcpServer();