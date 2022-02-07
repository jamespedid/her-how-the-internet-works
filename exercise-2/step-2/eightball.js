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