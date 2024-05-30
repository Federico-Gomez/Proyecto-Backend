const socket = io();

let username;
let email;
const chatBox = document.getElementById('chatBox');
const sendButton = document.getElementById('sendButton');
const messageLogs = document.getElementById('messageLogs');

//Bloquear pantalla del usuario y pedir un username
Swal.fire({
    title: 'Ingresa tu username',
    input: 'text',
    inputValidator: (value) => {
        return !value && '¡Debes ingresar un username válido!'
    },
    allowOutsideClick: false
}).then(result => {
    if (result.isConfirmed) {
        username = result.value;

        console.log(`Usuario identificado como: ${username}`);

        // Notificamos la conxión al servidor
        socket.emit('user-connected', username);
    }
});


// Escuchar el evento "Enter" y enviar el mensaje al chat por socket.io
chatBox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        const message = chatBox.value;
        if (message.trim().length > 0) {
            socket.emit('message', { username, message });
            chatBox.value = "";
        }
    }
});

sendButton.addEventListener('click', () => {
    const message = chatBox.value;
    if (message.trim().length > 0) {
        socket.emit('message', { username, message });
        chatBox.value = "";
    }
});

// Escuchar los mensajes provenientes del servidor y mostrarlos
socket.on('message', (data) => {
    const { username, message } = data;
    messageLogs.innerHTML += `${username} dice: ${message}<br>`;
})

socket.on('user-joined-chat', (username) => {
    Swal.fire({
        text: `${username} se ha conectado`,
        toast: true,
        position: 'top-right'
    });
});

