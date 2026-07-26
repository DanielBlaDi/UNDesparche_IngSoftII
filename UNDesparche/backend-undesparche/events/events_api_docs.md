# UNDesparche API — Módulo `events`

## Información General

Esta API gestiona los eventos del sistema UNDesparche. Permite listar y consultar eventos, crear nuevos eventos, publicarlos, editarlos, eliminarlos y gestionar suscripciones por usuario o correo electrónico.

**Base URL (desarrollo):** `http://127.0.0.1:8000`

**Formato:** JSON (`Content-Type: application/json`)

**Subida de imágenes:** cuando se envía un archivo de imagen, el request debe enviarse como `multipart/form-data`.

---

## Autenticación

Los endpoints que crean, editan, publican o eliminan eventos requieren autenticación mediante un **Firebase ID Token** obtenido al iniciar sesión con Google (`@unal.edu.co`).

El token se envía en el header de cada request:

```
Authorization: Bearer <firebase_id_token>
```

**Notas importantes:**
- El frontend debe enviar el token de Firebase en cada request autenticado.
- Los tokens de Firebase expiran cada 60 minutos y deben renovarse con `getIdToken(true)`.
- Los endpoints de consulta (`GET`) pueden responder públicamente para eventos publicados.

---

## Roles y permisos

| Rol | Permisos sobre eventos |
|---|---|
| Cualquier usuario | Puede ver eventos publicados y suscribirse a ellos. |
| Autenticado sin rol adicional | Puede ver eventos publicados y propios; puede suscribirse con usuario autenticado. |
| Administrador de Eventos | Puede crear eventos y modificarlos o eliminarlos si es el organizador. |
| Administrador del Sistema | Puede crear, modificar, publicar, eliminar y gestionar cualquier evento. |

---

## Esquema de datos

### Objeto `Event`

```json
{
  "id": 1,
  "name": "Taller de Git",
  "description": "Taller introductorio al control de versiones.",
  "published": false,
  "place": "Laboratorio 2",
  "latitude": 4.6383,
  "longitude": -74.084,
  "datetime_start": "2026-07-20T10:00:00-05:00",
  "datetime_end": "2026-07-20T12:00:00-05:00",
  "organizer": {
    "id": 2,
    "name": "Juan Pérez"
  },
  "status": "PRO",
  "category": "ACA",
  "image": "https://example.com/event-image.jpg",
  "is_subscribed": false
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Identificador único del evento. Solo lectura. |
| `name` | string | Nombre del evento. Obligatorio. |
| `description` | string | Descripción larga del evento. Obligatorio. |
| `published` | boolean | Indica si el evento ya está publicado. Solo lectura. |
| `place` | string | Lugar del evento. Obligatorio. |
| `latitude` | number | Latitud geográfica. Obligatorio. |
| `longitude` | number | Longitud geográfica. Obligatorio. |
| `datetime_start` | string (ISO 8601) | Fecha y hora de inicio. Obligatorio. |
| `datetime_end` | string (ISO 8601) | Fecha y hora de finalización. Obligatorio. |
| `organizer` | object | Información del organizador. Solo lectura. |
| `status` | string | Estado del evento. Valores posibles: `PRO`, `ECU`, `CAN`, `FIN`. |
| `category` | string \| null | Categoría del evento. Valores posibles: `ACA`, `CUL`, `DEP`, `ASA`, `PAR`, `OTR`. |
| `image` | string \| null | URL de la imagen asociada. Solo lectura. |
| `image_file` | file | Archivo de imagen para subir. Solo escritura. |
| `is_subscribed` | boolean | Indica si el usuario autenticado ya está suscrito al evento. Solo lectura. |

### Estados del evento (`status`)

| Valor | Descripción |
|---|---|
| `PRO` | Programado |
| `ECU` | En Curso |
| `CAN` | Cancelado |
| `FIN` | Finalizado |

### Categorías (`category`)

| Valor | Descripción |
|---|---|
| `ACA` | Académico |
| `CUL` | Cultural |
| `DEP` | Deportes |
| `ASA` | Asamblea |
| `PAR` | Parche |
| `OTR` | Otro |

---

## Endpoints

---

### `GET /events/`

Lista los eventos disponibles.

**Permisos:** Público. Los usuarios autenticados ven los eventos publicados y los que ellos organizaron. Los usuarios anónimos solo ven eventos publicados.

**Query params opcionales:**

| Parámetro | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `search` | string | Busca por nombre o lugar. | `?search=git` |
| `category` | string | Filtra por categoría. | `?category=ACA` |
| `category__in` | string | Filtra por varias categorías. | `?category__in=ACA,CUL` |
| `status` | string | Filtra por estado. | `?status=PRO` |
| `status__in` | string | Filtra por varios estados. | `?status__in=PRO,ECU` |
| `published` | boolean | Filtra por estado de publicación. | `?published=true` |
| `ordering` | string | Ordenamiento. Soporta `name` y `datetime_start`. | `?ordering=datetime_start` |

**Respuesta exitosa — `200 OK`:**

```json
[
  {
    "id": 1,
    "name": "Taller de Git",
    "description": "Taller introductorio al control de versiones.",
    "published": true,
    "place": "Laboratorio 2",
    "latitude": 4.6383,
    "longitude": -74.084,
    "datetime_start": "2026-07-20T10:00:00-05:00",
    "datetime_end": "2026-07-20T12:00:00-05:00",
    "organizer": {
      "id": 2,
      "name": "Juan Pérez"
    },
    "status": "PRO",
    "category": "ACA",
    "image": null,
    "is_subscribed": false
  }
]
```

**Ejemplo con curl:**

```bash
curl -s http://127.0.0.1:8000/events/
```

---

### `GET /events/{id}/`

Devuelve el detalle de un evento específico.

**Permisos:** Público, siempre y cuando el evento esté publicado, o el usuario autenticado sea el organizador.

**Respuesta exitosa — `200 OK`:** devuelve un objeto `Event` completo.

**Ejemplo con curl:**

```bash
curl -s http://127.0.0.1:8000/events/1/
```

---

### `POST /events/`

Crea un nuevo evento.

**Permisos:** Requiere autenticación. Solo `Administrador del Sistema` y `Administrador de Eventos`.

**Headers:**

```text
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre del evento. Obligatorio. |
| `description` | string | Descripción. Obligatorio. |
| `place` | string | Lugar. Obligatorio. |
| `latitude` | number | Latitud. Obligatorio. |
| `longitude` | number | Longitud. Obligatorio. |
| `datetime_start` | string (ISO 8601) | Fecha y hora de inicio. Obligatorio. |
| `datetime_end` | string (ISO 8601) | Fecha y hora de finalización. Obligatorio. |
| `status` | string | Estado inicial. Opcional, por defecto `PRO`. |
| `category` | string | Categoría. Opcional. |
| `image_file` | file | Imagen del evento. Opcional. |

**Ejemplo con curl:**

```bash
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Taller de Git" \
  -F "description=Taller introductorio" \
  -F "place=Laboratorio 2" \
  -F "latitude=4.6383" \
  -F "longitude=-74.084" \
  -F "datetime_start=2026-07-20T10:00:00-05:00" \
  -F "datetime_end=2026-07-20T12:00:00-05:00" \
  -F "status=PRO" \
  -F "category=ACA" \
  -F "image_file=@/ruta/a/imagen.jpg" \
  http://127.0.0.1:8000/events/
```

**Respuesta exitosa — `201 Created`:** devuelve el evento creado.

---

### `PATCH /events/{id}/`

Modifica parcialmente un evento existente.

**Permisos:** Requiere autenticación. Solo el organizador del evento o un `Administrador del Sistema` pueden modificarlo. Un evento publicado no puede modificarse si está cancelado o finalizado.

**Body (campos modificables):**

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nuevo nombre. |
| `description` | string | Nueva descripción. |
| `place` | string | Nuevo lugar. |
| `latitude` | number | Nueva latitud. |
| `longitude` | number | Nueva longitud. |
| `datetime_start` | string (ISO 8601) | Nueva fecha de inicio. |
| `datetime_end` | string (ISO 8601) | Nueva fecha de finalización. |
| `status` | string | Nuevo estado. |
| `category` | string | Nueva categoría. |
| `image_file` | file | Nueva imagen. |

**Ejemplo con curl:**

```bash
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Taller de Git actualizado"}' \
  http://127.0.0.1:8000/events/1/
```

**Respuesta exitosa — `200 OK`:** devuelve el evento actualizado.

---

### `DELETE /events/{id}/`

Elimina un evento del sistema.

**Permisos:** Requiere autenticación. El organizador puede eliminarlo, pero si el evento está publicado solo el `Administrador del Sistema` puede hacerlo.

**Respuesta exitosa — `204 No Content`:** sin cuerpo.

**Ejemplo con curl:**

```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/events/1/
```

---

### `POST /events/{id}/publish/`

Publica un evento que aún no ha sido publicado.

**Permisos:** Requiere autenticación. Solo el organizador del evento o un `Administrador del Sistema`.

**Respuesta exitosa — `200 OK`:** devuelve el evento con `published: true`.

**Ejemplo con curl:**

```bash
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/events/1/publish/
```

---

### `POST /events/{id}/subscribe/`

Suscribe a un usuario autenticado o a un correo electrónico a un evento.

**Permisos:** Público para eventos publicados. Si el usuario no está autenticado, se debe enviar el correo en el body.

**Body para usuario autenticado:** no requiere body.

**Body para suscripción por correo:**

```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta exitosa — `201 Created`:**

```json
{
  "detail": "Suscripción realizada correctamente."
}
```

**Ejemplo con curl (usuario autenticado):**

```bash
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/events/1/subscribe/
```

**Ejemplo con curl (correo):**

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com"}' \
  http://127.0.0.1:8000/events/1/subscribe/
```

---

### `POST /events/{id}/unsubscribe/`

Cancela una suscripción existente.

**Permisos:** Público para eventos publicados. Si el usuario no está autenticado, se debe enviar el correo en el body.

**Body para usuario autenticado:** no requiere body.

**Body para correo:**

```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta exitosa — `200 OK`:**

```json
{
  "detail": "Suscripción cancelada correctamente."
}
```

**Ejemplo con curl (usuario autenticado):**

```bash
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/events/1/unsubscribe/
```

---

## Códigos de estado y errores

| Código | Descripción |
|---|---|
| `200 OK` | Request exitoso. Devuelve el recurso solicitado o actualizado. |
| `201 Created` | Recurso creado correctamente (evento o suscripción). |
| `204 No Content` | Eliminación exitosa. |
| `400 Bad Request` | Datos inválidos o reglas de negocio violadas. |
| `403 Forbidden` | Sin permisos para realizar la acción. |
| `404 Not Found` | El evento solicitado no existe. |

**Estructura de error estándar:**

```json
{
  "detail": "Descripción del error."
}
```

**Ejemplos de errores comunes:**

```json
{
  "datetime_end": "La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio."
}
```

```json
{
  "detail": "Solo es posible suscribirse a eventos publicados."
}
```

```json
{
  "detail": "No es posible modificar un evento publicado que este cancelado o finalizado."
}
```
