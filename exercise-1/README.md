# Magic 8-Ball TCP Server

## Goal

The goal of the Magic 8-ball TCP Server is to produce a server that can take a question that is asked by a client and produce an answer for that question. Typically, Magic 8-balls are random, so that no matter how many times you ask a question, you'll receive a random response after shaking the ball. Other implementations might instead produce a single random answer from a question, and that answer will always be provided for that question. Here, we will do a mix of both.

After we produce this server, we will also create a client that can be used as an interface to ask questions to the Magic 8-ball server.

## Step 1 - Creating a Reply

Create a file called `server.js` in the example-1 folder. Inside this file we will look to add a function to produce a random response. First, let's start by adding an array with possible responses.

```javascript
// We store the possible responses into an array. Any array with at least one element will do.
const EightballResponses = [
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
```

Having the responses in an array like this will prove to be useful because the question of 'choosing a random response' instead will be changed to 'choose a number between 0 and n - 1, where n is the length of the array. We can simply choose a number in this fashion and use that as the index of the array to get the response.

Next, we should start with a function that can choose the Eightball response randomly. Here we will use the `Math.random` function to produce a number between 0 and 1. Numbers generated in this way will satisfy the mathematical inequality `0 <= x < 1`. If we take this number and multiply it by n, we have a number that satisfies `n * 0 <= n * x < n * 1`. From here, we can use the `Math.floor` function to chop off any decimal to produce a number between 0 and n - 1.

Example usage of Math.random
```javascript
let x = Math.random() // # x = 0.741559913016095
let m = EightballResponses.length * x // m = 14.831198260321901; EightBallResponses.length === 20
let i = Math.floor(m) // i = 14
```

Let's use this idea to choose a random reply. Add the following function to the `server.js` file

```javascript
function chooseEightballResponse(input) {
    let x = Math.random();
    let m = EightballResponses.length * x;
    let i = Math.floor(m);
    return EightballResponse[i];
}
```

We can test this function by immediately calling it in the `server.js` file and then running the file from the terminal. Add the following below the `chooseEightballResponse` function.

```javascript
// 
console.log(chooseEightballResponse('Is this a question?'));
```

From inside the example1 folder, run
```bash
node ./server.js
// My reply is no.
```

Here we have solved the first possibility: we have a random eightball that can produce a random reply from a question. However, sometimes this might not be desired. Instead, we might want to produce an answer to a question based on the input, and always return that same response for that input. For this, we can use a hashing function.

A hashing function is a function that can produce a number from an input. In this case, we're going to produce a simple hashing function to turn a string into a number. From there, we will produce a number between 0 and `EightballResponses.length`

To do this, we're going to loop over a string and get the character code for each of the character. The character code is a numeric representation of a character in a string based on a well-known standard. Then we will divide it by `EightballResponses.length` and take the remainder to get a number between 0 and `EightballResponses.length - 1` inclusive.

```javascript
function chooseEightballResponse(input) {
    let index = 0;
    for (let i = 0; i < input.length; i += 1) {
        index += input.charCodeAt(i);
    }
    let remainder = index % 20; // The modulo operator returns the remainder of the index      
                                // variable after dividing it by EightballResponses.length
    return EightballResponses[remainder];
}
```

Again, we can test this using the calling and logging the function.

Finally, we might want to choose both approaches at once. That is, we will randomly decide how to reply, and then choose a reply method.

Refactor the code to look like this.

```javascript
const EightballRandomThreshold = 0.25;

function chooseEightballResponse(input) {
    if (Math.random() < EightballRandomThreshold) {
        return chooseRandomReply(input);
    }
    return chooseReplyFromInputHash(input);
}

function chooseRandomReply() {
    let replyIndex = Math.floor(Math.random() * EightballResponses.length);
    return EightballResponses[replyIndex];
}

function chooseReplyFromInputHash(input) {
    let replyIndex = 0;
    for (let i = 0; i < input.length; i += 1) {
        replyIndex += input.charCodeAt(i);
    }
    return EightballResponses[replyIndex % EightballResponses.length];
}
```

Now this function that we produced will randomly decide to choose a random reply, or to choose a more stable reply. Let's test it a few times

```javascript
for (let i = 0; i < 10; i += 1) {
    console.log(chooseEightballResponse('Am I a question?'))
}
```

We're now ready to move onto step-2, which is to create the actual TCP server.

## Step 2 - Creating the TCP Server

Up to now, we created a javascript function to choose a random eightball reply. Now we will actually produce a tcp server to respond to requests. For this, `NodeJS` has a built-in way to build a tcp server, and that is located inside of the `net` import.

Let's add the following to the top of `server.js`:

```javascript
const net = require('net');
```

Doing this allows us to import code that is provided from `NodeJS` into our file. From here, we can create a tcp server.

Let's add a shell function for creating a tcp function and we'll add to it:

```javascript
function createTcpServer() {

}
```

The first thing we have to do to create a tcp server is to use the `createServer` function inside of the `net` import.

```javascript
const server = net.createServer();
```

The `server` object that created here is an event emitter. An event emitter allows for subscriptions to be added to it. These subscriptions are javascript functions that are called when the event emitter decides to 'raise' an event.

Example Event Emitter (contrived code)
```javascript
const event = new EventEmitter();
event.on('test', function onTest(value) { console.log(value); })
// then later
event.emit('test', 'this is the test value') // onTest('this is the test value') 
                                             // is called at this point
```

For this server object, there are two events that are raised that we care about: The `connection` event, and the `listening` event. We will use the `listening` event to simply log that we are now listening for incoming connections. We will use the `connection` event to get access to a `socket` object. More on what a `socket` object is will be be explained shortly.

First, we'll have a simple logging message when the `listening` event is raised.

```javascript
server.on('listening', () => {
    console.info(`listening for the eightball connections on port ${EightballServerPort}`);
});
```

You'll notice that I snuck in a variable that called `EightballServerPort`. We can define this in the server.js file as `const EightballServerPort = 8888`. This will be used in the future step when we tell the server to actually start listening.

Next, we'll subscribe to the `connection` event. Here we are given a `socket` object as a parameter to the callback function. The `socket` object represents an individual connection. That is to say, each `socket` will belong to a client that is connecting to the server.

The `socket` object is also an event emitter. For this example, we will only care about the `data` event. The `data` event will return a string or buffer that contains the question that is being asked. We will configure the socket to always return a string, so we won't have to worry about what a buffer is.

A `socket` is also a two-way street. In addition to receiving data during its `data` event, it can write back to the client a response using the `write` method.

So to receive a message from a connection, we need to implement a callback on the `server`'s `connection` event. That callback will allow us to subscribe to a `socket`'s `data` event which will give us access to the question being sent in by the client.

```javascript
server.on('connection', socket => {
    socket.setEncoding('utf8'); // this will automatically cause the data 
                                // parameter of the `data` callback to be a string.
    socket.on('data', data => {
        // here we receive the question as a string in the data variable.
    });

    console.log('received a connection to the magic eightball server');
});
```

Lastly, we need to generate the response to the question and write it to the socket

```javascript
const output = chooseEightballResponse(data);
console.log(`replying to ${data} with ${output}`);
socket.write(output); // writes the reply back to the client.
```

The only thing we have left to do is actually listen to the server

```javascript
server.listen(EightballServerPort);
```

Putting this all together, the createTcpServer function should look something like this:

```javascript
const EightballServerPort = 8888;

function createTcpServer() {
    const server = net.createServer();

    server.on('listening', () => {
        console.info(`listening for the eightball connections on port ${EightballServerPort}`);
    });

    server.on('connection', socket => {
        socket.setEncoding('utf8'); 

        socket.on('data', data => {
            const output = chooseEightballResponse(data);
            console.log(`replying to ${data} with ${output}`);
            socket.write(output); 
        });

        console.log('received a connection to the magic eightball server');
    });

    server.listen(EightballServerPort);
}

createTcpServer(); // call the function to create the tcp server
```

## Step 3 - Creating a Client REPL

Now that we have a tcp server, it can be connected to by a client application. For our purpose, we'll create a REPL that we can use to ask questions to the server.

The term REPL is an acronym that is short for Read-Evaluate-Print Loop. This is a style of interface where the end user can type in a question. The question is read by the looping program and then evaluated. The evaluation is then printed, and then the user is asked to input another question. This looping happens until the program is exited.

Fortunately, `NodeJS` provides us a `repl` library that we can use and modify to our needs.

Create a new file in the exercise-1 folder called `client.js` and require the 'repl' library. Create a function called `createClientRepl`.

```javascript
const repl = require('repl');

function createClientRepl() {

}
```

The `repl` package boasts a method called `start`, which creates a `replServer` object. The `replServer` object has an `exit` event that we'll subscribe to so that it plays nice with the rest of the `NodeJS` process. It also has a function called `displayPrompt` that can be used to gather input from the end user. Finally, the `replServer` object also has an output property that is a writable stream; it is an object with a `write` method that we can be used to send messages to.

```javascript
function createClientRepl() {
    const replServer = repl.start({
        prompt: 'Ask the magic eightball a yes or no question: ',
    });

    replServer.on('exit', () => {
        process.exit(0); // terminates when the REPL is issued the .exit command
    });

    replServer.displayPrompt(); // shows a user input.
}
```

Right now, the `replServer` will work, but it by default will evaluate javascript. We aren't looking to build a javascript REPL, but rather a magic eightball REPL. To change this, we can add an `eval` property to the input object for the `start` function.

```javascript
function sendCommand(input) {
    replServer.output.write(`Asking the magic eightball: ${input}\n`); // add a newline character so that it prints nicely.
    replServer.displayPrompt(); // ask for another question.
}

const replServer = repl.start({
    prompt: 'Ask the magic eightball a yes or no question: ',
    eval: sendCommand,
});
```

So now we have a REPL that can take in a user question, but all it is doing is logging that we are asking the magic eightball that question, and then immediately asking for a new question to be input. This will give us some scaffolding to work with to integrate connecting to the server with.

## Step 4 - Integrating a Connection Into the REPL

Now that we have a REPL, we need to be able to connect to the server and send messages. The same `net` library that we used for creating a server can also be used to connect to a `tcp` server.

```javascript
const socket = net.createConnection({
    host: 'localhost',
    port: EightballServerPort,
});
```

Here we see that we have a familiar `socket`. In addition to using the `data` event, which will now be used to respond to replies from the server, we'll also use the `error`, `connect`, and `ready` events to facilitate working with this connection. Unlike the sockets that were created automatically from the server, we have control over when this `socket` is created and what happens when it connects.

```javascript
socket.on('error', () => {
        console.error('Could not connect to the magic eightball server.');
    });

socket.on('connect', () => {
    console.log('connected to the eightball server');
    socket.setEncoding('utf8');
});

socket.on('ready', () => {
    // we can now do things with the socket
});
```

Now we can get to the juicy part. Once the socket is ready, we're going to create a REPL for that socket.

```javascript
socket.on('ready', () => {
    createClientRepl(socket);
});
```

Notice that we are now calling the createClientRepl function with a parameter: `socket`. So in order to use this properly, we'll need to modify our `createClientRepl` function to accept a socket parameter.

```javascript
function createClientRepl(socket) {
```

From here, we'll need to do two things: First we'll need to write the question to the socket during the `sendCommand` function. Second, we need to subscribe isten to the `data` event of the socket. In this subscription callback, we'll print the answer to the question, and then we'll move the `replServer.displayPrompt` in here as well so that only one question can be asked at a time.

```javascript
function sendCommand(input) {
    replServer.output.write(`Asking the magic eightball: ${input}\n`); 
    socket.write(input);
}

socket.on('data', response => {
    const message = `Magic eightball replied with: ${response}\n`;
    replServer.output.write(message);
    replServer.displayPrompt();
});
```

Putting it all together, we have

```javascript
const repl = require('repl');
const net = require('net');

const EightballServerPort = 8888;

function createClientRepl(socket) {
    function sendCommand(input) {
        replServer.output.write(`Asking the magic eightball: ${input}\n`);
        socket.write(input);
    }

    const replServer = repl.start({
        prompt: 'Ask the magic eightball a yes or no question: ',
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
        port: EightballServerPort,
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
```

Now we can run `server.js` and `client.js` in two different terminals to start a server and then ask questions to it

```bash 
node ./server.js
```

```bash
node ./client.js
```
