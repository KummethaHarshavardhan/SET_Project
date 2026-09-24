import { io } from 'socket.io-client';
import { getToken } from './authService';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = getToken();
    socket = io(url, { transports: ['websocket', 'polling'], auth: { token } });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
