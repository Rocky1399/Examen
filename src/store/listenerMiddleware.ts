import { createListenerMiddleware } from '@reduxjs/toolkit';
import { login, logout } from '../features/auth/authSlice';
import { authStorage } from '../features/auth/authStorage';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login.fulfilled, // cuando el login sale bien…
  effect: (action) => authStorage.save(action.payload), // …guarda
});

listenerMiddleware.startListening({
  actionCreator: logout, // cuando se hace logout…
  effect: () => authStorage.clear(), // …borra
});
