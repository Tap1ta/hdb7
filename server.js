const express = require('express');
const app = express();

const port = 3000; // Configuración directa del puerto 3000

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', client => {
    console.log(`connection received`);
    client.on('new_message', (chat) => {
        console.log(`new message received: ${chat}`);
        io.emit('broadcast', chat);
    });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(port, () => {
    console.log(`server running at ${port}...`);
});
