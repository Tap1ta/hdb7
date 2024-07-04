const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', client => {
    console.log(`connection received`);
    client.on('new_message', (chat) => {
        console.log(`new message received: ${chat}`)
        io.emit('broadcast', chat)
    })
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`server running at ${port}...`);
});
