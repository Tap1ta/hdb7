import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname); // Now you can use __dirname in your ES module

dotenv.config();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDjI7yScWWii4x3kptJfG23jfyyRR-45k",
  authDomain: "hdb4-88d11.firebaseapp.com",
  projectId: "hdb4-88d11",
  storageBucket: "hdb4-88d11.appspot.com",
  messagingSenderId: "829021793366",
  appId: "1:829021793366:web:60dc8ecf1a5a862e4d9ff7",
  measurementId: "G-FS9VKQ1R2H"
};


// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Configuración de Express y Socket.io
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Middleware de logging
app.use(logger('dev'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Escuchar conexiones Socket.io
io.on('connection', (socket) => {
  console.log('a user has connected!');

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  });

  socket.on('chat message', async (msg) => {
    const username = socket.handshake.auth.username || 'anonymous';
    console.log({ username, msg });

    try {
      // Añadir mensaje a Firebase Realtime Database
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      await newMessageRef.set({
        content: msg,
        user: username,
        timestamp: Date.now()
      });

      io.emit('chat message', msg, username); // Emitir mensaje a todos los clientes
    } catch (error) {
      console.error('Error writing message to Firebase:', error);
    }
  });
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
