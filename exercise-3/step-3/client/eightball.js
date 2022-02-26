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

            fetch('./api/eightball', {
                method: 'POST',
                body: value
            }).then(response => {
                responseElement.textContent = response;
            }).finally(() => {
                inputSubmitElement.disabled = false;
                inputElement.disabled = false;
            });
        }
    }
})();