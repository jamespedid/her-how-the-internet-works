# Magic 8-Ball Client Side Application

## Goal

The goal of the Magic 8-Ball Client Side Application project is to create a web page using HTML and Javascript to produce a client side magic eightball application. This application demonstrates that some websites can operate just by having client-side code that runs in the browser, and not using any backend servers.

For this web page, we'll have an input element to accept a magic eightball question as input. Then we'll compute a response for the magic eightball on the client side.

## Step 0 - Run npm install in the exercise-2 folder and run server to start a static webserver

```bash
npm install
node ./server.js
```

All work done in this exercise will be in the workarea folder.

## Step 1 - Creating the HTML

An HTML document is a text document that is used to describe the "structure" of a web page. The MIME type of an HTML document is typically `text/html` or `application/html`. 

As a recap, an HTML document is written using blocks. A block is something of the form `<tag attributeName="attributeValue"> tagBody </tag>`. There's a few important pieces here: 

1. A block is a start tag, followed by contents, followed by an ending tag.
2. The starting tag begins with a tag name, and then may be followed by attributes.
3. The contents of an HTML block can be empty, text, or another HTML block.

HTML begins and ends with a single block. Everything else is nested inside of that block. The tag of that block must be `html`. Further, we subdivide this html block using exactly two html elements: the `head` tag and the `body` tag.

On a side node, if an html block has no content, we can shorthand the block by closing the tag: `<div />`. It is simply worth noting that `<div />` is identical to `<div></div>`. Certain tags are expected to have contents, like the `div` tag, and others are expected to never have contents, like the `input` tag. 

```html
<html>
    <head></head>
    <body></body>
</html>
```

Anything inside of the `head` tag _will not_ be rendered by the browser. Instead, we typically require resources, such as CSS or Javascript files, in the `head`.

Anything inside of the `body` tag will be rendered in the browser, where the user can then interact with it.

Let's create a simple HTML page called `eightball.html` that shows the included Eightball image.

```html
<html>
    <head></head>
    <body>
        <img src="./eightball.png"/>
    </body>
</html>
```

We can open this webpage by going to `http://localhost:8888/eightball.html` file in the chrome browser. Opening it, we'll see a magic eightball sitting on a page with a white background.

For this web page, we'll need to know about some valid html tags that are recognized by the browser. We'll use the `main`, `section`, `p`, `form`, `input`, `button` and `script` tags. 

For now, let's remove the eightball image and put in a `main` block followed by a `script` tag.

```html
<html>
    <head></head>
    <body>
        <main></main>
        <script></script>
    </body>
</html>
```

If we reload the page in the browser, we'll see that the Eightball is now missing. We can verify that the page is what we're expecting by opening the Chrome Developer Tools (while the chrome browser is the active window, hit F12). Inside the developer tools, we can click on the elements tab to see the loaded HTML document. We will see the same HTML structure that we have.

Now, let's add two sections into the `main` block. Inside the first section, let's add the eightball image back in, and then add in a `p` tag with no contents. A `p` tag is a _paragraph_ tag; it is a tag where the expected content is text. We'll also want to give the `p` tag an attribute called `id` and have a value of `response` for that `id` attribute.

```html
<html>
    <head></head>
    <body>
        <main>
            <section>
                <img src="./eightball">
                <p id="response"></p>
            </section>
            <section></section>
        </main>
        <script></script>
    </body>
</html>
```

If we reload the page, we will see the magic eightball image once more, along with an empty text paragraph we added right underneath it.

In the second section, first add `p` tag with the contents: `Ask the eightball a yes or no question`. Then add a `form` tag with an `id` of `input-form`. Then, inside of the `form` tag, add an `input` tag with an `id` of `question` and a `type` attribute of `text`. The input element has no contents, so we close it using the shorthand tag version. Also add a button with id of `input-submit` and type of `submit`, and the contents of the button will be text `Ask the Eightball`.

```html
<html>
    <head></head>
    <body>
        <main>
            <section>
                <img src="./eightball">
                <p id="response"></p>
            </section>
            <section>
                <p>
                    Ask the magic eightball a question
                </p>
                <form id='input-form'>
                    <input id='question' type='text'/>
                    <button id='input-submit' type='submit'>
                        Ask the Eightball
                    </button>
                </form>
            </section>
        </main>
        <script></script>
    </body>
</html>
```

If we refresh the page, we'll see an text input element that you can type into, and a button that does nothing when clicked.

Let's also inspect the developer tools to see that the elements tab shows the correct HTML structure that we would expect.

We are now ready to move onto step 2.

# Step 2 - Wiring up the Button with Javascript

Up until this point, we have an empty script tag in our HTML document. Let's add an attribute `type` of `text/javascript` and a `src` attribute of `./eightball.js`. Then, create an empty javascript file called `eightball.js` in the same directory as `eightball.html`.

We are able to use the `src` attribute to refer to javascript written in another file, in this case the `eightball.js` file.

Here, we're going to use a technique called an _Immediately Invoked Function Expression_, or IIFE for short. In your `eightball.js` file, create an empty function called `loadApplication` and wrap the entire function in parentheses. Then, after the close parentheses, immediately call the function.

```javascript
(function loadApplication() {

})();
```

Inside the `loadApplication` function, let's have something happen when the page is done loading. That thing will be to make the button work. There is a special variable available to javascript in the browser called the `window` object. This object is the top-most level object in the entire javascript hierarchy.

Conveniently enough, this window object is an event emitter, and one of its events is the `load` event. So let's create a function called `onLoad` and subscribe it to the `load` event of the `window` object.

```javascript
(function loadApplication() {
    window.addEventListener('load', onLoad);

    function onLoad() {

    }
})();
```

Let's clarify what it means that _the window object is the top-most level object in the entire javascript hierarchy_. The browser interprets an HTML document and produces a rendered piece of content that can be interacted with. To do this, the browser maintains javascript objects that represent the different pieces of HTML in memory. These javascript objects were coded as part of a well-defined standard on how to do this, called the Document Object Model, or the DOM for short.

The `window` object is the parent object that hosts the rendering process. Inside the `window`, the HTML document is read and interpreted into a javascript object stored in the `document` variable on the `window` object.

The reason we do the IIFE technique is to make sure that any variables we define do not end up in the global scope on the `window` object. This can lead to some cumbersome interactions when using shared code, so instead we want to make our variables private to other javascript scopes.

This way, the `document` variable has access, as special properties, to the javascript objects belonging to `body` and `head`. We can also access the javascript objects belonging to various other tags using various means. The javascript objects corresponding to tags are called _elements_. We added `id` attributes into the HTML to help us find a few of the elements that we will be working with.

Let's go ahead and get some of those elements at the beginning of the onLoad function and store those into variables.

```javascript
(function loadApplication() {
    window.addEventListener('load', onLoad);

    function onLoad() {
        const responseElement = document.getElementById('response');
        const inputElement = document.getElementById('question');
        const inputFormElement = document.getElementById('input-form');
        const inputSubmitElement = document.getElementById('input-submit');
    }
})();
```

Now that we have these elements, we can do things with them. First off, every element in the browser is an event emitter and has a wide catalog of events that can be subscribed to. Second, each of these elements has access to a variety of properties that can be useful when handling events issued to elements.

The `form` element that we added has an event called the `submit` event. This event is triggered whenever a button inside the form that has a `type` of `submit` is clicked. The default behavior of the form submit will cause an HTTP request to go to a server somewhere. We'll instead tell the browser _not_ to do this, and do something else. For now, we'll have it log to the console in the developer tools.

```javascript
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

            console.log('submit event was processed');
            console.log('log the event object so we can take a peek in the developer tools');
            console.log(event);
        }
    }
})();
```

## Step 3 - Incorporating Magic Eightball Logic

Now, we'll incorporate the logic to choose a magic eightball reply and write it to the `p` element with the id of `response`. Borrowing from what we used in `exercise-1`, we can copy and paste that logic into here for reuse. (There are other ways of reusing code, but that's outside of the scope of this course.)

We can read the contents of the `input` element by looking at the `value` property of the `inputElement` variable. We can then set the output value of the magic eightball reply to be on the `textContent` property of the `responseElement`.

```javascript
function onSubmit(event) {
    event.preventDefault(); // this will stop the default form submit behavior from occurring.

    const value = inputElement.value;
    responseElement.textContent = chooseEightballResponse(value);
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
```

Now we can click the button, and the response element will have the contents of the magic eightball reply. However, this is a little rushed and unsatisfying. Instead, let's simulate an artificial wait by using the setTimeout function. The setTimeout function accepts a callback and a time to wait, measured in milliseconds. We'll wait two seconds before setting the output. We'll also disable the input and button elements during this time.

```javascript
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
```

The final result should look something like this:

```javascript
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
```