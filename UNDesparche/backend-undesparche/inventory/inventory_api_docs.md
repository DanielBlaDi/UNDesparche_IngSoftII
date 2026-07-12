# UNDesparche API — Módulo `inventory`

## Información General

Esta API gestiona los implementos deportivos y de apoyo del sistema UNDesparche. Permite listar, consultar, crear, actualizar y eliminar implementos, además de gestionar reservas y préstamos asociados.

**Base URL (desarrollo):** `http://127.0.0.1:8000`

**Formato:** JSON (`Content-Type: application/json`)

**Subida de imágenes:** cuando se envía un archivo de imagen, el request debe enviarse como `multipart/form-data`.

---

## Autenticación

Los endpoints de creación, edición y eliminación requieren autenticación mediante un **Firebase ID Token** obtenido al iniciar sesión con Google (`@unal.edu.co`).

El token se envía en el header de cada request:

```
Authorization: Bearer <firebase_id_token>
```

**Notas importantes:**
- Los usuarios autenticados pueden consultar la lista de implementos.
- Los endpoints de administración solo están disponibles para roles autorizados.
- Los tokens de Firebase expiran cada 60 minutos y deben renovarse con `getIdToken(true)`.

---

## Roles y permisos

| Rol | Permisos sobre implementos |
|---|---|
| Usuario autenticado | Puede listar y ver implementos. |
| Administrador de Implementos | Puede crear, editar y eliminar implementos de su facultad. |
| Administrador del Sistema | Puede gestionar cualquier implemento, incluyendo asignar la facultad. |

---

## Esquema de datos

### Objeto `Implement`

```json
{
  "id": 1,
  "name": "Balón de fútbol",
  "category": "BAL",
  "faculty": "ING",
  "state": "DIS",
  "description": "Balón oficial para prácticas deportivas.",
  "image": "https://example.com/ball.jpg"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Identificador único del implemento. Solo lectura. |
| `name` | string | Nombre del implemento. Obligatorio. |
| `category` | string | Categoría del implemento. Valores posibles: `BAL`, `RAQ`, `MES`, `JUR`, `JUM`, `OTS`. |
| `faculty` | string \| null | Facultad asociada al implemento. Obligatorio para administradores del sistema. |
| `state` | string | Estado del implemento. Valores: `DIS`, `NDS`, `RES`, `PRE`. |
| `description` | string | Descripción del implemento. Obligatorio. |
| `image` | string \| null | URL de la imagen asociada. Solo lectura. |
| `image_file` | file | Archivo de imagen para subir. Solo escritura. |

### Categorías (`category`)

| Valor | Descripción |
|---|---|
| `BAL` | Balones |
| `RAQ` | Raquetas |
| `MES` | Mesas |
| `JUR` | Juegos recreativos |
| `JUM` | Juegos de mesa |
| `OTS` | Otros |

### Facultades (`faculty`)

| Código | Facultad |
|---|---|
| `ART` | Artes |
| `CCS` | Ciencias |
| `CIA` | Ciencias Agrarias |
| `CIE` | Ciencias Económicas |
| `CHS` | Ciencias Humanas |
| `DER` | Derecho, Ciencias Políticas y Sociales |
| `ENF` | Enfermería |
| `ING` | Ingeniería |
| `MED` | Medicina |
| `MVZ` | Medicina Veterinaria y Zootecnia |
| `ODO` | Odontología |

### Estados (`state`)

| Valor | Descripción |
|---|---|
| `DIS` | Disponible |
| `NDS` | No disponible |
| `RES` | Reservado |
| `PRE` | Prestado |

---

## Endpoints

---

### `GET /inventory/implements/`

Lista todos los implementos registrados.

**Permisos:** Cualquier usuario autenticado.

**Headers:**

```text
Authorization: Bearer <token>
```

**Query params opcionales:**

| Parámetro | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `search` | string | Busca por nombre o descripción. | `?search=balón` |
| `category` | string | Filtra por categoría. | `?category=BAL` |
| `faculty` | string | Filtra por facultad. | `?faculty=ING` |

**Respuesta exitosa — `200 OK`:**

```json
[
  {
    "id": 1,
    "name": "Balón de fútbol",
    "category": "BAL",
    "faculty": "ING",
    "state": "DIS",
    "description": "Balón oficial para prácticas deportivas.",
    "image": null
  }
]
```

**Ejemplo con curl:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/inventory/implements/
```

---

### `GET /inventory/implements/{id}/`

Devuelve el detalle de un implemento específico.

**Permisos:** Cualquier usuario autenticado.

**Respuesta exitosa — `200 OK`:** devuelve un objeto `Implement` completo.

**Ejemplo con curl:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/inventory/implements/1/
```

---

### `POST /inventory/implements/`

Crea un nuevo implemento.

**Permisos:** Requiere autenticación. Solo `Administrador de Implementos` y `Administrador del Sistema`.

**Headers:**

```text
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre del implemento. Obligatorio. |
| `category` | string | Categoría. Opcional. |
| `faculty` | string | Facultad asociada. Obligatorio si el usuario es Administrador del Sistema. |
| `state` | string | Estado inicial. Opcional, por defecto `NDS`. |
| `description` | string | Descripción. Obligatorio. |
| `image_file` | file | Imagen del implemento. Opcional. |

**Ejemplo con curl:**

```bash
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Balón de fútbol" \
  -F "category=BAL" \
  -F "faculty=ING" \
  -F "state=DIS" \
  -F "description=Balón oficial para prácticas" \
  -F "image_file=@/ruta/a/imagen.jpg" \
  http://127.0.0.1:8000/inventory/implements/
```

**Respuesta exitosa — `201 Created`:** devuelve el implemento creado.

---

### `PATCH /inventory/implements/{id}/`

Modifica parcialmente un implemento existente.

**Permisos:** Requiere autenticación. Solo el `Administrador de Implementos` de la misma facultad o el `Administrador del Sistema` pueden modificarlo.

**Body (campos modificables):**

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nuevo nombre. |
| `category` | string | Nueva categoría. |
| `faculty` | string | Nueva facultad (solo administrador del sistema). |
| `state` | string | Nuevo estado. No se permiten `RES` ni `PRE` por edición manual. |
| `description` | string | Nueva descripción. |
| `image_file` | file | Nueva imagen. |

**Ejemplo con curl:**

```bash
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"state": "DIS", "description": "Balón actualizado"}' \
  http://127.0.0.1:8000/inventory/implements/1/
```

**Respuesta exitosa — `200 OK`:** devuelve el implemento actualizado.

---

### `DELETE /inventory/implements/{id}/`

Elimina un implemento del sistema.

**Permisos:** Requiere autenticación. Solo `Administrador de Implementos` de la misma facultad o `Administrador del Sistema`.

**Respuesta exitosa — `204 No Content`:** sin cuerpo.

**Ejemplo con curl:**

```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/inventory/implements/1/
```

---

## Endpoints relacionados del módulo

### Reservas

- `GET /inventory/reserves/`
- `POST /inventory/reserves/`
- `POST /inventory/reserves/{id}/confirm/`
- `POST /inventory/reserves/{id}/cancel/`

### Préstamos

- `GET /inventory/borrowings/`
- `POST /inventory/borrowings/{id}/return/`

Estos endpoints permiten gestionar el ciclo completo de disponibilidad, reserva y préstamo de un implemento.

---

## Códigos de estado y errores

| Código | Descripción |
|---|---|
| `200 OK` | Request exitoso. Devuelve el recurso solicitado o actualizado. |
| `201 Created` | Recurso creado correctamente. |
| `204 No Content` | Eliminación exitosa. |
| `400 Bad Request` | Datos inválidos o reglas de negocio violadas. |
| `403 Forbidden` | Sin permisos para realizar la acción. |
| `404 Not Found` | El implemento solicitado no existe. |

**Estructura de error estándar:**

```json
{
  "detail": "Descripción del error."
}
```

**Ejemplos de errores comunes:**

```json
{
  "faculty": "El Administrador del Sistema debe especificar la facultad del implemento."
}
```

```json
{
  "detail": "Este implemento no está disponible para reservar."
}
```
