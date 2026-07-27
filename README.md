# UNDesparche

## Descripción

**UNDesparche** es una aplicación web desarrollada para la Universidad Nacional de Colombia que permite a los estudiantes reservar implementos recreativos de las diferentes facultades y mantenerse informados sobre los eventos que se realizan dentro del campus.

Además, la plataforma facilita la gestión de préstamos de implementos por parte de los administradores correspondientes y permite a los organizadores crear y administrar eventos para difundir actividades dirigidas a la comunidad universitaria.

El objetivo del proyecto es promover una comunidad universitaria más activa mediante una plataforma centralizada para la administración de implementos y eventos.

---

# Estructura del proyecto

La estructura general del proyecto es la siguiente:

```text
UNDesparche
├── backend-undesparche
│   ├── core
│   ├── events
│   ├── inventory
│   ├── mediafiles
│   ├── notifications
│   ├── staticfiles
│   ├── undesparche  <---- Aquí va un .env que se usaría para correr el backend en local sin Docker.
│   ├── users
│   ├── .gitignore
│   ├── Dockerfile
│   ├── firebase_credentials.json  <---- Credenciales de Firebase que usa el backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_data.py
│   └── UNDesparche-drf.zip
├── frontend-undesparche
│   ├── public
│   ├── src
│   ├── .env.example    <---- Con este .env.example como plantilla, se crea el .env que se usaría para correr el frontend en local sin Docker.
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── test_api.zip
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .env <---- .env que usa Docker Compose
├── .env.local <---- Este .env.local se usa de plantilla para crear el .env que usa Docker Compose
├── .gitignore
├── docker-compose.yml
└── test_api.zip
```


---

# Tecnologías utilizadas

- Python
- Django
- Django REST Framework
- React
- TypeScript
- Docker
- Docker Compose
- PostgreSQL
- Firebase Authentication
- Google Maps API

---

# Configuración e instalación

## Requisitos previos

Antes de ejecutar el proyecto es necesario contar con:

- Docker (y las dependencias que utiliza para correr como WSL2)

Además, deben configurarse los siguientes archivos:

### Archivo `.env`

Debe ubicarse en la raíz del proyecto y contener las variables de entorno necesarias para la ejecución de la aplicación mediante Docker Compose.
(Mire Estructura del proyecto para ubicarse mejor)

### Archivo `firebase_credentials.json`

Debe ubicarse dentro de la carpeta:

```text
backend-undesparche/firebase_credentials.json
```

Este archivo corresponde a las credenciales del servicio Firebase Admin SDK utilizadas por el backend.

---

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/DanielBlaDi/UNDesparche_IngSoftII.git
```
2. Dirigirse a la carpeta `UNDesparche`

3. Crear el archivo `.env` en la raíz del proyecto (UNDesparche/.env) y llenarlo con la información respectiva de este.

4. Crear el archivo `firebase_credentials.json` dentro de la carpeta `backend-undesparche/` y llenarlo con la información respectiva de este.

5. Construir e iniciar los contenedores:

```bash
docker compose up --build
```

Este comando construirá las imágenes necesarias e iniciará todos los servicios de la aplicación.

---

# Uso del proyecto

Una vez que los contenedores se encuentren en ejecución, la aplicación estará disponible en:

## Frontend

```
http://localhost:5173
```

## Backend

```
http://localhost:8000
```

Para detener la aplicación:

```bash
docker compose down
```
