# TCGnew_Backend_Jesus_Torrecillas
# Tecnologias :  React, Node.js/Express, MongoDB, Docker 
# Jesus Torrecillas
# El proyecto esta en proceso, pero se ejecutara en docker y se usara mongoDB


# PRACTICA 2

# CREAR UN docker-compose.yml

# crearlo con el puerto 4521:27017 para que se enlaze con mongodb
# lanzarlo con docker-compose up -d
# conectar MongoDB Compass con: mongodb://USUARIO:CONTRASEÑA@localhost:4521/?authSource=admin
# (el usuario y la contraseña son los del docker-compose.yml; no se suben al repositorio)

---

# PRACTICA 3 – Sesión 6: categorías, usuarios, errores y Postman

API REST con Node.js, Express 5 y MongoDB (Mongoose). Arquitectura por capas:
`routes → controllers → services → models`.

## Requisitos
- Node.js 20.19 o superior
- Docker con MongoDB en marcha (`docker compose ps` debe mostrar el contenedor activo)
- Postman Desktop (o Postman Web con Desktop Agent)
- MongoDB Compass (opcional, para comprobar los datos)

## Instrucciones de ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar MongoDB:
   ```bash
   docker compose up -d
   docker compose ps
   ```
3. Crear el archivo `.env` copiando `.env.example` y rellenando tus datos:
   ```
   MONGO_URI=mongodb://USUARIO:CONTRASEÑA@localhost:4521/ecommerce?authSource=admin
   PORT=3000
   ```
   El `.env` no se sube a GitHub (está en `.gitignore`).
4. Arrancar la API:
   ```bash
   npm run dev
   ```
   Debe aparecer `MongoDB connectat correctament` y `Servidor escoltant al port 3000`.

## Estructura
```
src/
├── config/db.js              conexión a MongoDB
├── models/                   carta, category, usuari
├── services/                 lógica de negocio y acceso a datos
├── controllers/              reciben la petición y responden
├── routes/                   endpoints
├── middleware/
│   ├── errorHandler.js       404 + manejador global de errores
│   └── validateObjectId.js   valida el :id antes de consultar
├── utils/
│   ├── AppError.js           error controlado (status, code, details)
│   └── query.js              filtros, orden y paginación validados
├── app.js                    Express: middleware y rutas
└── index.js                  arranque: .env + BD + listen
postman/                      colección y entorno exportados
```

## Endpoints

| Recurso | Endpoints | Códigos |
|---|---|---|
| Productos (cartas) | `POST/GET /api/products`, `GET/PUT/DELETE /api/products/:id` | 201 / 200 / 200 / 200 / 204 |
| Categorías | `POST/GET /api/categories`, `GET/PUT/DELETE /api/categories/:id` | 201 / 200 / 200 / 200 / 204 |
| Usuarios | `POST/GET /api/users`, `GET/PUT/DELETE /api/users/:id` | 201 / 200 / 200 / 200 / 200 (baja lógica) |

`/api/cartas` funciona como alias de `/api/products`.

> **Aviso:** los endpoints de usuarios todavía no tienen autenticación (JWT/RBAC llegan en sesiones siguientes). Usarlos solo en local con datos ficticios; no desplegar.

## Novedades de esta sesión

- **Categorías:** modelo `Category` (`name` mínimo 3 caracteres, `slug` único, `description` máximo 500, `active`, timestamps). Las cartas tienen un campo `category` (referencia a la categoría) y se devuelven con `populate()`. No se puede borrar una categoría que tenga cartas asignadas (409).
- **Usuarios:** la contraseña (mínimo 12 caracteres) se guarda como hash **bcrypt**, nunca en texto plano ni se devuelve. El servidor asigna `role=client`; `role`, `active` y `passwordHash` no se aceptan desde el body. `DELETE` desactiva el usuario (`active=false`).
- **Errores centralizados:** middleware global con un único formato de respuesta y sin trazas internas.
- **Filtros, orden y paginación** en categorías y usuarios.

### Filtros, orden y paginación
```
GET /api/categories?active=true
GET /api/categories?name=info
GET /api/categories?sort=name
GET /api/users?name=anna
GET /api/users?sort=-createdAt
GET /api/users?page=2&limit=5
```
- `page` y `limit`: enteros positivos (por defecto 1 y 10; máximo 100).
- `sort`: campos permitidos; el prefijo `-` ordena de forma descendente.
- Respuesta: `{ "success": true, "data": [], "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 } }`

### Formato de error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les dades no són vàlides",
    "details": [{ "field": "name", "message": "El nombre es obligatorio" }]
  }
}
```

| HTTP | Significado | Ejemplo |
|---|---|---|
| 200 | OK | Consulta correcta |
| 201 | Created | Recurso creado |
| 204 | No Content | Eliminación |
| 400 | Bad Request | ID o parámetros incorrectos |
| 404 | Not Found | Recurso inexistente |
| 409 | Conflict | Email o slug duplicado |
| 422 | Unprocessable Content | Error de validación o campo no permitido |
| 500 | Internal Server Error | Error inesperado |

## Importación de Postman

1. Abrir Postman e ir a **Import** (o `Ctrl+O`).
2. Importar los dos archivos de la carpeta `postman/`:
   - `ecommerce.postman_collection.json` (colección **Ecommerce API** con las carpetas Products, Categories y Users)
   - `ecommerce_local.postman_environment.json` (entorno **Ecommerce Local**, `baseUrl = http://localhost:3000`)
3. Seleccionar el entorno **Ecommerce Local** (arriba a la derecha).
4. Con la API arrancada, ejecutar la colección con **Run collection**. Las peticiones llevan tests automáticos (código de estado, formato JSON y que no se exponga `passwordHash`).

La colección no contiene secretos: solo datos ficticios y la variable `baseUrl`.

## Comprobación en MongoDB Compass
Conectar con `mongodb://USUARIO:CONTRASEÑA@localhost:4521/?authSource=admin`, abrir la base `ecommerce` y revisar:
- `categories`, `cartas` (campo `category`) y `usuaris`.
- La pestaña **Indexes**: `slug_1` en `categories` y `email_1` en `usuaris`, ambos únicos.