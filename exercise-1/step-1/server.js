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
const EightballRandomThreshold = 0.25;

function chooseEightballResponse(input) {
    if (shouldReplyWithRandomResponse()) {
        return chooseRandomReply();
    }
    return chooseReplyFromInputHash(input);
}

function shouldReplyWithRandomResponse() {
    return Math.random() < EightballRandomThreshold;
}

function chooseRandomReply() {
    const replyIndex = Math.floor(Math.random() * EightballResponses.length);
    return EightballResponses[replyIndex];
}

function chooseReplyFromInputHash(input) {
    let replyIndex = 0;
    for (let i = 0; i < input.length; i += 1) {
        replyIndex += input.charCodeAt(i);
    }
    let indexRemainder = replyIndex % EightballResponses.length;
    return EightballResponses[indexRemainder];
}

for (let i = 0; i < 10; i += 1) {
    console.log(chooseEightballResponse('Am I a question?'))
}

