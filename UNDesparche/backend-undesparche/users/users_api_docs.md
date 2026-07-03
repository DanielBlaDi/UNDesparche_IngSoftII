# UNDesparche API — Módulo `users`

## Información General

Esta API gestiona los usuarios del sistema UNDesparche. Permite consultar el perfil propio, listar usuarios registrados, modificar su estado y roles, y eliminarlos. El acceso está restringido según el rol del usuario autenticado.

**Base URL (desarrollo):** `http://127.0.0.1:8000`

**Formato:** JSON (`Content-Type: application/json`)

---

## Autenticación

Todos los endpoints requieren autenticación mediante un **Firebase ID Token** obtenido al iniciar sesión con Google (`@unal.edu.co`).

El token se envía en el header de cada request:

```
Authorization: Bearer <firebase_id_token>
```

**¿Cómo obtener el token?**

El frontend usa el SDK de Firebase para autenticar al usuario con Google y obtener el token:

```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const result = await signInWithPopup(auth, provider);
const token = await result.user.getIdToken(); // enviar este token en cada request

// Para renovar el token (expira cada hora):
const freshToken = await result.user.getIdToken(true);
```

**Notas importantes:**
- Solo se aceptan correos con dominio `@unal.edu.co`. Cualquier otro dominio es rechazado con `403`.
- Los tokens de Firebase expiran cada **60 minutos**. El frontend debe renovarlos con `getIdToken(true)` antes de que expiren.
- Un usuario nuevo se crea automáticamente en el sistema la primera vez que se autentica — no existe un endpoint de registro separado.

---

## Roles del sistema

| Rol | Descripción |
|---|---|
| Miembro de la Comunidad | Cualquier usuario autenticado sin rol adicional asignado. Valor por defecto. |
| Administrador de Eventos | Puede gestionar eventos. |
| Administrador de Implementos | Puede gestionar inventario y sancionar usuarios. |
| Administrador del Sistema | Acceso completo. Puede gestionar usuarios, roles y estados. |

---

## Esquema de datos

### Objeto `User`

```json
{
  "id": 1,
  "email": "vcanonc@unal.edu.co",
  "name": "Victor Camilo Canon Castellanos",
  "faculty": "ING",
  "status": "ACT",
  "is_active": true,
  "roles": ["Administrador del Sistema"],
  "date_joined": "2026-07-02T17:28:24.440253-05:00"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Identificador único del usuario. Solo lectura. |
| `email` | string | Correo institucional `@unal.edu.co`. Solo lectura. |
| `name` | string | Nombre completo obtenido de Google. Solo lectura. |
| `faculty` | string \| null | Código de facultad. Obligatorio al asignar el rol de Administrador de Implementos. Ver tabla de facultades. |
| `status` | string | Estado del usuario. Valores: `"ACT"` (Activo), `"SAN"` (Sancionado). |
| `is_active` | boolean | Si es `false`, el usuario está baneado y no puede autenticarse. |
| `roles` | string[] | Lista de roles del usuario. Si está vacío, se devuelve `["Miembro de la Comunidad"]`. |
| `date_joined` | string (ISO 8601) | Fecha y hora de registro. Solo lectura. |

### Tabla de facultades (`faculty`)

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

---

## Endpoints

---

### `GET /users/me/`

Devuelve el perfil del usuario autenticado.

**Permisos:** Cualquier usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa — `200 OK`:**
```json
{
  "email": "vcanonc@unal.edu.co",
  "name": "Victor Camilo Canon Castellanos",
  "faculty": null,
  "status": "ACT",
  "roles": ["Miembro de la Comunidad"]
}
```

**Ejemplo con JavaScript (fetch):**
```javascript
const response = await fetch("http://127.0.0.1:8000/users/me/", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
const user = await response.json();
```

**Ejemplo con curl:**
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/users/me/
```

---

### `GET /users/`

Lista todos los usuarios registrados. Soporta filtros y búsqueda.

**Permisos:** Administrador del Sistema, Administrador de Implementos.

**Headers:**
```
Authorization: Bearer <token>
```

**Query params opcionales:**

| Parámetro | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `search` | string | Busca por nombre o email (parcial, insensible a mayúsculas). | `?search=victor` |
| `status` | string | Filtra por estado: `ACT` o `SAN`. | `?status=SAN` |
| `groups__name` | string | Filtra por rol. Usar `"Miembro de la Comunidad"` para usuarios sin rol adicional. | `?groups__name=Administrador+de+Eventos` |

**Respuesta exitosa — `200 OK`:**
```json
[
  {
    "id": 1,
    "email": "vcanonc@unal.edu.co",
    "name": "Victor Camilo Canon Castellanos",
    "faculty": null,
    "status": "ACT",
    "is_active": true,
    "roles": ["Administrador del Sistema"],
    "date_joined": "2026-07-02T17:28:24.440253-05:00"
  },
  {
    "id": 2,
    "email": "prueba@unal.edu.co",
    "name": "",
    "faculty": null,
    "status": "ACT",
    "is_active": true,
    "roles": ["Miembro de la Comunidad"],
    "date_joined": "2026-07-02T17:37:54.447814-05:00"
  }
]
```

**Ejemplos con curl:**
```bash
# Listar todos
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/users/

# Buscar por nombre o email
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:8000/users/?search=victor"

# Filtrar por estado sancionado
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:8000/users/?status=SAN"

# Filtrar por rol
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:8000/users/?groups__name=Miembro+de+la+Comunidad"
```

---

### `GET /users/{id}/`

Devuelve el detalle de un usuario específico.

**Permisos:** Administrador del Sistema, Administrador de Implementos.

**Path params:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario. |

**Respuesta exitosa — `200 OK`:**
```json
{
  "id": 2,
  "email": "prueba@unal.edu.co",
  "name": "",
  "faculty": null,
  "status": "ACT",
  "is_active": true,
  "roles": ["Miembro de la Comunidad"],
  "date_joined": "2026-07-02T17:37:54.447814-05:00"
}
```

**Ejemplo con curl:**
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/users/2/
```

---

### `PATCH /users/{id}/`

Modifica parcialmente un usuario. Permite cambiar `status`, `is_active` y `roles`.

**Permisos:**
- Administrador del Sistema: puede modificar `status`, `is_active`, `roles` y `faculty`.
- Administrador de Implementos: solo puede modificar `status`.
- Ningún rol puede modificar a otro Administrador del Sistema.

**Path params:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario a modificar. |

**Body (campos modificables):**

| Campo | Tipo | Descripción |
|---|---|---|
| `status` | string | `"ACT"` para activar, `"SAN"` para sancionar. |
| `is_active` | boolean | `false` para banear, `true` para desbanear. |
| `roles` | string[] | Lista de roles a asignar. Reemplaza los roles actuales. Usar `[]` para quitar todos los roles. |
| `faculty` | string \| null | Código de facultad. **Obligatorio** cuando `roles` incluye `"Administrador de Implementos"`. |

**Sancionar un usuario — Body:**
```json
{ "status": "SAN" }
```

**Banear un usuario — Body:**
```json
{ "is_active": false }
```

**Cambiar rol — Body:**
```json
{ "roles": ["Administrador de Eventos"] }
```

**Asignar rol de Administrador de Implementos (requiere facultad) — Body:**
```json
{ "roles": ["Administrador de Implementos"], "faculty": "ING" }
```

**Cambiar solo la facultad — Body:**
```json
{ "faculty": "ART" }
```

**Quitar todos los roles (vuelve a Miembro de la Comunidad) — Body:**
```json
{ "roles": [] }
```

**Respuesta exitosa — `200 OK`:** devuelve el objeto `User` actualizado completo.

**Ejemplos con curl:**
```bash
# Sancionar
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SAN"}' \
  http://127.0.0.1:8000/users/2/

# Asignar rol de Administrador de Implementos con facultad
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roles": ["Administrador de Implementos"], "faculty": "ING"}' \
  http://127.0.0.1:8000/users/2/

# Cambiar solo la facultad
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"faculty": "ART"}' \
  http://127.0.0.1:8000/users/2/

# Cambiar rol a Administrador de Eventos
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roles": ["Administrador de Eventos"]}' \
  http://127.0.0.1:8000/users/2/
```

---

### `DELETE /users/{id}/`

Elimina un usuario del sistema.

**Permisos:** Solo Administrador del Sistema. No se puede eliminar a otro Administrador del Sistema.

**Path params:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario a eliminar. |

**Respuesta exitosa — `204 No Content`:** sin cuerpo.

**Ejemplo con curl:**
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/users/2/
```

---

## Códigos de estado y errores

| Código | Descripción |
|---|---|
| `200 OK` | Request exitoso. Devuelve el recurso solicitado o actualizado. |
| `204 No Content` | Eliminación exitosa. Sin cuerpo en la respuesta. |
| `400 Bad Request` | El body tiene errores de validación (ej. rol inexistente). |
| `403 Forbidden` | Sin permisos para realizar la acción, o token inválido/dominio no permitido. |
| `404 Not Found` | El usuario con ese ID no existe. |

**Estructura de error estándar:**
```json
{
  "detail": "Descripción del error."
}
```

**Errores de validación (`400`):**
```json
{
  "roles": ["Object with name=RolInexistente does not exist."]
}
```

```json
{
  "faculty": ["Debe asignar una facultad al Administrador de Implementos."]
}
```

**Ejemplo de error de permisos (`403`):**
```json
{
  "detail": "No se puede modificar a un Administrador del Sistema."
}
```
