document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#validate')
        .addEventListener('click', () => {
            const inputNumber = document.querySelector('#num').valueAsNumber;
            const inputAsInteger = parseInt(inputNumber);
            const messageDiv = document.querySelector('#message');

            if (isNaN(inputNumber) || inputNumber !== inputAsInteger) {
                messageDiv.classList.remove('success');
                messageDiv.classList.add('error');
                messageDiv.textContent = 'El número ingresado no es entero!';
            } else {
                messageDiv.classList.add('success');
                messageDiv.classList.remove('error');
                messageDiv.textContent = 'El número ingresado es entero!';
            }
        });
});