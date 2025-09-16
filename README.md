# Aplicación de Gestión de Tareas Fracttal

Este repositorio contiene una aplicación completa de gestión de tareas (full-stack) construida con React, Node.js (Express) y PostgreSQL.

## Configuración del Backend

### Prerrequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

*   Node.js (v18 o superior)
*   npm (viene con Node.js)
*   Docker y Docker Compose (para ejecutar PostgreSQL)

### 1. Navega al Directorio del Backend

```bash
cd backend
```

### 2. Instala las Dependencias

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` basándote en `.env.example`.

```
# .env example
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasklist_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
PORT=3001
```

**Nota:**
*   `DATABASE_URL`: Configúralo para que apunte a tu instancia de PostgreSQL. Si usas Docker Compose, el host será `db` (ej., `postgresql://postgres:postgres@db:5432/tasklist_db?schema=public`).
*   `JWT_SECRET`: Genera una cadena fuerte y aleatoria para la firma de tokens JWT.
*   `PORT`: El puerto en el que se ejecutará el servidor backend. (Por defecto: 3001)

### 4. Configuración de la Base de Datos (PostgreSQL con Docker Compose)

Usaremos Docker Compose para configurar fácilmente una base de datos PostgreSQL.

Primero, asegúrate de estar en el directorio raíz del proyecto (donde se encuentra `docker-compose.yml`).

```bash
cd ..
```

Luego, inicia el contenedor de PostgreSQL:

```bash
docker-compose up -d db
```

Esto iniciará un contenedor de PostgreSQL llamado `db`. Puedes verificar que está funcionando con `docker-compose ps`.

### 5. Ejecuta las Migraciones de Prisma

Una vez que el contenedor de PostgreSQL esté en funcionamiento, navega de nuevo al directorio `backend/` y aplica las migraciones de la base de datos:

```bash
cd backend
npx prisma migrate dev --name initial_setup
```

Este comando creará las tablas necesarias en tu base de datos PostgreSQL.

### 6. Inicia el Servidor Backend

```bash
npm run dev
```

El servidor backend debería estar ahora ejecutándose en `http://localhost:3001` (o el puerto especificado en tu archivo `.env`).

## Documentación de la API

La documentación de la API está disponible a través de Swagger UI. Una vez que el servidor backend esté en funcionamiento, puedes acceder a ella en:

`http://localhost:3001/api-docs`

Esta documentación interactiva te permite explorar todos los endpoints disponibles, sus esquemas de solicitud/respuesta e incluso probarlos directamente.

## Configuración del Frontend

### Prerrequisitos

Asegúrate de tener instalado Node.js (v18 o superior) y npm.

### 1. Navega al Directorio del Frontend

```bash
cd frontend
```

### 2. Instala las Dependencias

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en el directorio `frontend/` según tus necesidades. Para el desarrollo, es posible que necesites especificar la URL de la API del backend si no se está ejecutando en la dirección predeterminada `http://localhost:3001/api`.

```
# .env example for frontend
VITE_API_BASE_URL="http://localhost:3001/api"
```

### 4. Inicia el Servidor de Desarrollo del Frontend

```bash
npm run dev
```

La aplicación frontend debería estar ahora ejecutándose en `http://localhost:5173` (o en otro puerto si está configurado por Vite).
