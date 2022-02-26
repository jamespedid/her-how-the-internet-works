(function loadApplication() {
    window.addEventListener('load', onLoad);

    function onLoad() {
        const responseElement = document.getElementById('response');
        const inputElement = document.getElementById('question');
        const inputFormElement = document.getElementById('input-form');
        const inputSubmitElement = document.getElementById('input-submit');

        inputFormElement.addEventListener('submit', onSubmit);

        function onSubmit(event) {
            event.preventDefault(); // this will stop the default form submit behavior from occurring.

            const value = inputElement.value;
            
            responseElement.textContent = 'Asking...';
            inputSubmitElement.disabled = true;
            inputElement.disabled = true;

            setTimeout(function onTimeout () {
                responseElement.textContent = chooseEightballResponse(value);
                inputSubmitElement.disabled = false;
                inputElement.disabled = false;
            }, 2000) // 2000 milliseconds is two seconds.
        }
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
})();