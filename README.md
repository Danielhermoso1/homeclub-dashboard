# Homeclub Dashboard Comercial

Dashboard de KPIs comerciales de Homeclub.

## Cómo actualizar datos

Edita el objeto `REAL_DATA` en `src/App.jsx`. Cada mes tiene su propia entrada con:
- `revenue`: facturación por destino (v26 = 2026, v25 = 2025, obj = objetivo)
- `ocupacion`: % ocupación por ciudad
- `leads`: inbound calls y missed rate
- `bookings`: reservas confirmadas y duración media
- `b2b`: facturación B2B

## Cómo correr en local

```bash
npm install
npm run dev
```

## Cómo hacer deploy en Vercel

1. Sube esta carpeta a un repositorio de GitHub
2. Ve a vercel.com → New Project → importa el repo
3. Vercel detecta Vite automáticamente → Deploy
4. Cada vez que hagas push a GitHub, Vercel redeploya solo

