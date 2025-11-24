# NodeJS JWT Prisma API

API RESTful construida con Node.js, Express, Prisma ORM y autenticación JWT. Incluye configuración para Docker, tests con Jest y documentación con Swagger.

## 🚀 Características

- **Autenticación**: JWT (JSON Web Tokens) con refresh tokens.
- **ORM**: Prisma con soporte para PostgreSQL.
- **Base de Datos**: PostgreSQL.
- **Validación**: Express-validator.
- **Logging**: Winston con rotación de logs.
- **Seguridad**: Helmet, Rate Limiting, CORS.
- **Documentación**: Swagger UI.
- **Tests**: Jest y Supertest.
- **Docker**: Dockerfile y docker-compose listos para usar.

## 📋 Requisitos Previos

- Node.js (v18 o superior recomendado)
- PostgreSQL
- Docker (opcional)

## 🛠️ Instalación

1.  **Clonar el repositorio**

    ```bash
    git clone <url-del-repositorio>
    cd nodejs-javascript-api-template
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**

    Copia el archivo de ejemplo y ajusta los valores según tu entorno:

    ```bash
    cp .env.example .env
    ```

    Asegúrate de configurar correctamente la `DATABASE_URL` en el archivo `.env`.

4.  **Inicializar la base de datos**

    ```bash
    npm run prisma:migrate
    ```

## ▶️ Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

### Docker

```bash
npm run docker:up
```

## 🧪 Tests

Ejecutar la suite de pruebas:

```bash
npm test
```

## 🔗 Inicio de la Aplicación

```bash
http://localhost:3000
```

## 📚 Documentación API

Una vez iniciada la aplicación, visita:

```
http://localhost:3000/api-docs
```

## 📂 Estructura del Proyecto

```
src/
├── config/         # Configuraciones (DB, Logger, Swagger)
├── controllers/    # Controladores de la API
├── middlewares/    # Middlewares (Auth, Error Handler)
├── models/         # Modelos adicionales (si aplica)
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── utils/          # Utilidades (AppError, JWT)
└── app.js          # Configuración de Express
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
