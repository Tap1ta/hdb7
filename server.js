const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Crear la aplicación Express
const app = express();

// Crear el servidor HTTP usando Express
const server = http.createServer(app);

// Crear la instancia de Socket.IO y configurarla para manejar CORS
const io = socketIo(server, {
    cors: {
        origin: "*", // Permitir todas las solicitudes de origen (ajusta esto según sea necesario)
        methods: ["GET", "POST"]
    }
});

// Manejar nuevas conexiones de clientes
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar eventos de mensaje
    socket.on('sendMessage', (message) => {
        console.log('Mensaje recibido: ', message);
        io.emit('newMessage', message); // Emitir el mensaje a todos los clientes conectados
    });

    // Manejar desconexiones de clientes
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor y escuchar en el puerto 3000
server.listen(3000, () => {
    console.log('El servidor está corriendo en el puerto 3000');
});
