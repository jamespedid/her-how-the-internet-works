const net = require('net');
const fs = require('fs/promises');

function sendHttpRequestWithTcp() {
   const socket = net.connect({
        host: 'google.com',
        port: 80,
    }, () => {
        socket.on('data', message => {
            console.log(message);
        });
    
        socket.on('ready', () => {
            socket.setEncoding('utf8');
            fs.readFile('httpRequest.txt', 'utf8')
                .then(httpMessage => {
                    console.log(httpMessage);
                    socket.write(httpMessage);
                });
        });

        socket.on('close', () => {
            process.exit(0);
        });
    });
}

sendHttpRequestWithTcp();