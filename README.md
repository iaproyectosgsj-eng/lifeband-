# Lifeband (Blink Smart Solutions)

## Visión general
Lifeband es una app móvil (Expo + React Native + TypeScript) para administrar pulseras médicas NFC/QR. El único rol es **ADMIN**, quien crea y gestiona perfiles de portadores con información médica crítica. El acceso público a la información se realiza mediante un PDF generado en servidor (no se expone JSON).

## Arquitectura

### Capas principales
- **UI (screens + components)**: Presentación y flujos de navegación.
- **Services**: Acceso a Supabase (Auth/DB/Edge Functions) y fallback local.
- **Types**: Tipos TypeScript compartidos.
- **Supabase (migraciones)**: Esquema de base de datos y políticas RLS.

### Flujo de autenticación
1. **Login/Register** usan `supabase.auth` (email/password + Google).
2. Al iniciar sesión o registrarse, se asegura la existencia de un perfil en `admins`.
3. El `AppNavigator` decide si renderiza `AuthStack` o `AppStack`.

### Datos y seguridad
- Todas las tablas tienen **RLS** (Row Level Security) por `admin_id`.
- La app no expone datos sensibles públicamente.
- El acceso público debe resolverse vía Edge Function para generar PDF.

## Estructura de carpetas

```
.
├── App.tsx
├── index.ts
├── app.json
├── package.json
├── supabase/
│   ├── migrations/
│   └── README.md
└── src/
    ├── components/
    │   └── common/
    ├── constants/
    ├── navigation/
    ├── screens/
    │   ├── auth/
    │   └── app/
    ├── services/
    └── types/
```

### Archivos raíz
- **App.tsx**: Componente raíz que monta la navegación principal.
- **index.ts**: Entry point de Expo (`registerRootComponent`).
- **app.json**: Configuración de Expo (iconos, splash, plugins).
- **package.json**: Dependencias y scripts.

### `src/components/common/`
Componentes reutilizables para UI:
- **Button.tsx**: Botón con variantes y estado de carga.
- **Input.tsx**: Input con label y estado de error.
- **Card.tsx**: Contenedor con borde y sombra.
- **DatePicker.tsx**: Selector de fecha con modal.
- **SearchableDropdown.tsx**: Dropdown modal con opciones predefinidas.

### `src/constants/`
Constantes globales de UI y catálogos:
- **colors.ts**: Paleta, tipografías y espaciado.
- **countries.ts**: Lista de países.
- **languages.ts**: Lista de idiomas.
- **index.ts**: Re-export de constantes.

### `src/navigation/`
Navegación de la app:
- **AppNavigator.tsx**: Decide AuthStack/AppStack según sesión.
- **AuthStack.tsx**: Login + registro.
- **AppStack.tsx**: Dashboard, detalle de portador, wizard, etc.

### `src/screens/`
Pantallas principales:
- **auth/**: Login y registro por pasos.
- **app/**: Dashboard, detalle de portador, settings, etc.

### `src/services/`
Servicios de datos:
- **supabase.ts**: Cliente Supabase + helpers de Auth.
- **database.ts**: Operaciones DB + fallback local.
- **index.ts**: Re-export de servicios.

### `src/types/`
- **index.ts**: Tipos TypeScript para entidades y navegación.

### `supabase/`
- **migrations/**: SQL para crear tablas y RLS.
- **README.md**: Cómo aplicar migraciones.

## Configuración de Supabase
- Variables esperadas:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Las políticas RLS asumen que `auth.uid()` = `admins.id`.

## PDF público
El PDF debe generarse desde Edge Function al crear/editar datos médicos y servirse vía endpoint público seguro (p. ej. `/p/{qr_token}`) validando estado y permisos.

## Scripts
- `npm run start`: Expo Dev Server
- `npm run web`: Ejecuta app en web
- `npm run ios` / `npm run android`: Ejecuta en simulador
