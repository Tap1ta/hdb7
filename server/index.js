import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://culturar-git-main-esquema-rs-projects.vercel.app/',
    methods: ['GET', 'POST']
  }
});

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

// Middleware para servir archivos estáticos
const staticPath = path.resolve('./server/client'); // Ajusta según la estructura de tu proyecto
app.use(express.static(staticPath));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
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
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
