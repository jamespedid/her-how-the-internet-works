const repl = require('repl');

function createClientRepl() {
    function sendCommand(input) {
        replServer.output.write(`Asking the magic eightball: ${input}\n`); // add a newline character so that it prints nicely.
        replServer.displayPrompt(); // ask for another question.
    }

    const replServer = repl.start({
        prompt: 'Ask the magic eightball a yes or no question: ',
        eval: sendCommand,
    });

    replServer.on('exit', () => {
        process.exit(0); // terminates when the REPL is issued the .exit command
    });

    replServer.displayPrompt(); // shows a user input.
}