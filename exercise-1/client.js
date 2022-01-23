const repl = require('repl');
const net = require('net');

const EightBallServerPort = 8888;

function createClientRepl(socket) {
    function sendCommand(input) {
        replServer.output.write(`Asking the magic eightball: ${input}\n`);
        socket.write(input);
    }

    const replServer = repl.start({
        prompt: 'Ask the magic eightball a question: ',
        eval: sendCommand,
    });

    replServer.on('exit', () => {
        socket.destroy();
        process.exit(0);
    });

    socket.on('data', response => {
        const output = `Magic eightball replied with: ${response}\n`;
        replServer.output.write(output);
        replServer.displayPrompt();
    });

    replServer.displayPrompt();
}

function createClient() {
    const socket = net.createConnection({
        host: 'localhost',
        port: EightBallServerPort,
    });

    socket.on('error', () => {
        console.error('Could not connect to the magic eightball server.');
    });

    socket.on('connect', () => {
        console.log('connected to the eightball server');
        socket.setEncoding('utf8');
    });

    socket.on('ready', () => {
        createClientRepl(socket);
    });
}

createClient();