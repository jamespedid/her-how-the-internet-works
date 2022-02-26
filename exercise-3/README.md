# Magic 8-Ball Client-Server Side Application

## Goal

The goal of the Magic 8-Ball Client-Server Side Application project is to demonstrate a web page that has a client-side component (called the frontend, or user-interface) and a server-side component (called the backend, or application programmable interface [API for short]). The client-side component is often a person using a web page, and the server-side component is a computer that automatically processes requests for that web page.

In the Magic 8-Ball Client Side Application, we seen an example of a web server that is capable of serving static content. A content is static if it doesn't change at all between requests. Here, we'll build an example of a server-side application that will serve content dynamically.

## Step 0 - Initialize the project structure.

In the `workarea` folder of `exercise-3`, create a folder called `server` and a folder called `client`. The file tree underneath `exercise-3` should look like

```
 workarea
 |-client
 |-server
 package-lock.json
 package.json
 README.md
```

Navigate to the `exercise-3` folder in the terminal and run the following command:

```bash
npm install
```

You should see an output that looks like this

```sh
npm WARN eightball-application@0.0.0 No repository field.
npm WARN eightball-application@0.0.0 No license field.

added 55 packages from 37 contributors and audited 55 packages in 2.445s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Doing this will download all of the third party dependencies that we will need to create a web server that can serve content dynamically. You'll notice that we now also have a `node_modules` folder underneath the `exercise-3` folder.

```
 node_modules
 workarea
 |-client
 |-server
 package-lock.json
 package.json
 README.md
```

## Step 1 - Copy the Result of Exercise-2 into your client folder

We will begin our quest of creating a dynamic web server by instead creating a static web server to serve our client-side content. We will use this as a means to deliver the client-side application to the end user by using a static web server. This means that the client doesn't need to have any special software on their computer in order to use our magic 8-ball server.

To do this, copy the entire result of `exercise-2` into the `client` folder. We will use this as a starting point, and rewrite the application so that it uses a backend webserver for providing the magic 8-ball responses.

Then, create a file in the `server` folder called `server.js`

You'll have a file tree that looks something like

```
 node_modules
 workarea
 |-client
 |--eightball.html
 |--eightball.js
 |--eightball.png
 |-server
 |--server.js
 package-lock.json
 package.json
 README.md
```

Inside `server.js`, we'll need to initialize a web server. To do this, we'll use a third-party library called express. We'll use the express static middleware in order to serve static content, and we'll use the `morgan` middleware to log requests. We'll also add a redirect so that going to the web page without any path will work.

```javascript
// server.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const MagicEightballServerPort = 8888;

function initializeServer(){
    const app = express();
    app.use(morgan('dev'));
    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.redirect('/eightball.html');
            return;
        }
        next();
    })
    app.use(express.static(path.join(__dirname, '..', 'client')));

    app.listen(MagicEightballServerPort, () => {
        console.log(`Magic eightball webserver listening on port ${ServerPort}`);
    });
}

initializeServer();
```

Now we can start our webserver by going to the `workarea` folder in the terminal and typing `npm run start`. You should see an output like this in the terminal:

```sh
Magic eightball webserver listening on port 8888
```

If we go to the browser, we should be able to view the web page by going to `http://localhost:8888/`.

Note: if this fails to start, we have to make sure we shut down the webserver that we were running in exercise-2.

## Step 2 - Adding a Magic 8-ball Handler

Now we can add in the magic 8-ball logic that we have created before to our web-server to dynamically show content based on the entered magic eightball response. 

To do this easily, we can use `app.use` to put in an express handler to return the results. We'll need to use the bodyParser middleware to get the request sent to us in the `req.body` property of the request object.

```javascript
// add const bodyParser = require('bodyparser') at the top of the file
// add magic eightball functions we've created in the file as well

app.use(morgan('dev'))
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
```

So now when someone sends a POST request to our server at `http://localhost:8888/api/eightball` we'll reply with a magic 8-ball response after a short artificial delay.

## Step 3 - Modifying the Client Side Code

At this point, even though we have added the logic to perform a magic 8-ball request using HTTP, we still are not using it from our client side code. Let's open up `client/eightball.js`. Inside of this file, we need to remove all of the logic that is used to generate a magic 8-ball reply.

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

            // setTimeout(function onTimeout () {
            //     responseElement.textContent = chooseEightballResponse(value);
            //     inputSubmitElement.disabled = false;
            //     inputElement.disabled = false;
            // }, 2000) // 2000 milliseconds is two seconds.
        }
    }
})();
```

Now let's make an HTTP request using the `fetch` library.

```javascript
inputElement.disabled = true;

fetch('./api/eightball', {
    method: 'POST',
    body: value
}).then(response => {
    return response.text();
}).then(response => {
    responseElement.textContent = response;
}).finally(() => {
    inputSubmitElement.disabled = false;
    inputElement.disabled = false;
});
```

Now when we click the button, we should get the magic 8-ball from the web server instead of being generated on the client side.