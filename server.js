const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000; // Permite usar el puerto configurado o el 3000 por defecto

io.on('connection', client => {
    console.log(`Cliente conectado: ${client.id}`);

    client.on('sendMessage', (jsonMessage) => {
        try {
            const message = JSON.parse(jsonMessage);
            console.log(`Nuevo mensaje recibido: ${message.text}`);
            io.emit('newMessage', message); // Emitir el mensaje a todos los clientes conectados
        } catch (error) {
            console.error('Error al parsear el mensaje JSON:', error);
        }
    });

    client.on('disconnect', () => {
        console.log(`Cliente desconectado: ${client.id}`);
    });
});

app.get('/', (req, res) => {
    res.send('Servidor Socket.IO en funcionamiento');
});

server.listen(port, () => {
    console.log(`Servidor Socket.IO escuchando en el puerto ${port}`);
});
