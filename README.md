# Proyecto E-commerce (Frontend)

Frontend de la aplicación de e-commerce desarrollada con React y Vite.

Este proyecto funciona junto al backend que se encuentra en la carpeta `PA-Backend`.

Requisitos

- Node.js v16+ y npm
- Backend corriendo (por defecto en `http://localhost:4000`)

Instalación y ejecución (Windows PowerShell)

1. Abrir una terminal en la carpeta del frontend:

```powershell
cd 'C:\Users\Valderrama\documents\WEB\PA-Front'
```

2. Instalar dependencias:

```powershell
npm install
```

3. Arrancar en modo desarrollo:

```powershell
npm run dev
```

4. Abrir `http://localhost:5173` (o la URL que muestre Vite) en el navegador.

Configuración

- El frontend llama a la API en `http://localhost:4000/api` (ver `src/services/*`). Si cambias el puerto del backend o lo despliegas, actualiza las URLs en `src/services/*` o configura un proxy.

Pruebas rápidas

- Inicia backend y frontend.
- Regístrate / inicia sesión.
- Agrega productos al carrito y procede a pagar en `/payment`.

Notas para entrega

- Incluye captura de pantalla del diagrama ER y del flujo de la app (opcional).
- Asegúrate de que el backend tenga la base de datos con datos de ejemplo (usa el endpoint `POST /api/productos/cargarProductos` del backend para cargar `data/productSeed.json`).


