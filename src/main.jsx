import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import App from './App';
import { RouterProvider } from './router/Router';
import { AccesibilidadProvider } from './context/AccesibilidadContext';
import { CarritoProvider } from './context/CarritoContext';
import { AvisosProvider } from './context/AvisosContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider>
      <AccesibilidadProvider>
        <AvisosProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </AvisosProvider>
      </AccesibilidadProvider>
    </RouterProvider>
  </StrictMode>,
);
