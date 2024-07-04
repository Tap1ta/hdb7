const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// Certificados SSL
const privateKey = fs.readFileSync('path/to/your/private-key.pem', 'utf8');
const certificate = fs.readFileSync('path/to/your/certificate.pem', 'utf8');
const ca = fs.readFileSync('path/to/your/ca.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const port = 3000;

const server = https.createServer(credentials, app);
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
