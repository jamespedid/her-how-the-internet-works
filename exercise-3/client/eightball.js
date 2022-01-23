(function loadApplication() {
    window.addEventListener('load', onLoad);

    function onLoad() {
        const responseElement = document.getElementById('response');
        const inputElement = document.getElementById('question');
        const inputFormElement = document.getElementById('input-form');
        
        inputFormElement.addEventListener('submit', event => {
            event.preventDefault();

            const input = inputElement.value;
            inputFormElement.setAttribute('disabled', 'disabled');
            
            responseElement.textContent = 'Asking...'

            fetch('/api/eightball', {
                method: 'POST',
                body: input,
            }).then(httpResponse => {
                return httpResponse.text();
            }).then(response => {
                responseElement.textContent = `Magic eightball says: ${response}`;
                inputFormElement.removeAttribute('disabled');
            });
        })
    }
})();