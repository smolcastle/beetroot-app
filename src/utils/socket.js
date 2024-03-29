import socketIOClient from 'socket.io-client';
const SERVER = 'http://localhost:8080';

// socketIOClient connects front-end to with socket backend URL

export const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 20,
  reconnectionDelay: 5000
});
