# EcoHarmony Park – Release v1.0.0

Aplicación full‑stack para inscribirse a actividades del parque (Tirolesa, Palestra, Safari). Incluye:
- Backend en Django con endpoints públicos para listar actividades y registrar inscripciones.
- Frontend en React (Vite) con formulario, validaciones y flujo de confirmación.

Jira de referencia:
https://sebastiansidorowicz.atlassian.net/jira/software/projects/TDD/boards/1/backlog?epics=visible&selectedIssue=TDD-45


## Resumen del release

Fecha: 20/10/2025

Alcance principal:
- Listado de actividades con filtros por tipo, disponibilidad, fecha y hora.
- Inscripción multi-persona con validaciones (edad mínima, DNI, talle cuando corresponde, cupos, TyC).
- Seed automático de actividades post migraciones.
- CORS configurado para el front local.

Puertos por defecto:
- Backend: http://127.0.0.1:8000
- Frontend: http://localhost:5173


## Requisitos previos

- Windows (cmd.exe) o equivalente.
- Python 3.10+ (recomendado 3.11/3.12).
- Node.js 18+ (recomendado 20+), npm 9+.
- Git (opcional).


## Dependencias por capa

Backend (Python/Django):
- Django 5.2.3
- django-cors-headers (CORS)
- SQLite (incluida por defecto)
- Tests (solo desarrollo):
	- pytest
	- requests

Frontend (React/Vite):
- react ^19.1.1
- react-dom ^19.1.1
- react-router-dom ^7.9.4
- Dev tooling: vite ^7, eslint ^9, @vitejs/plugin-react ^5


## Instalación rápida (Windows)

Cloná el repo (si corresponde) y abrí dos terminales: una para Backend y otra para Frontend.

Backend:

```bat
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```


Frontend:

```bat
cd Frontend
npm install
npm run dev
```

Abrí http://localhost:5173


## Configuración y ambientes

Backend:
- CORS permitido por defecto para `http://localhost:5173` (ver `backInscribirseActividad/settings.py`).


Frontend:
- La URL del backend está embebida en los fetch de `src/components/FormularioInscripcion.jsx` como `http://127.0.0.1:8000/api`. Ajustar para otros ambientes.


## Endpoints API (Backend)

Base: `http://127.0.0.1:8000/api`

1) GET `/actividades`
- Parámetros opcionales:
	- `tipo` (string, p. ej. "Palestra", "Tirolesa", "Safari", "Jardineria")
	- `disponible` ("true" | "false")
	- `hora` (HH:MM, filtra actividades a partir de esa hora)
	- `dia` (YYYY-MM-DD)
- Respuesta 200 OK: lista de actividades
	- `[{ id_actividad, tipo, descripcion, fecha, hora, cupo_disponible }, ...]`
- Respuesta 404: `{ "mensaje": "No se encontraron actividades." }`

2) POST `/inscribirse_actividad`
- Body JSON:
```json
{
	"id_actividad": 2,
	"cant_personas": 1,
	"terminosYcondiciones": true,
	"personas": [
		{ "nombre": "Juan Pérez", "dni": 45074602, "edad": 22, "talle": "XL" }
	]
}
```
- Respuesta 201 OK:
```json
{
	"mensaje": "Inscripción registrada correctamente",
	"id_inscripcion": 123,
	"actividad": "Palestra",
	"cupo_restante": 7
}
```
- Errores comunes (400):
	- `Debe aceptar los términos y condiciones`
	- `La actividad no está disponible`
	- `No hay cupos disponibles`
	- `Debe ingresar el talle para: <nombre>` (para actividades que requieren equipamiento)


## Ejecución local

1. Levantar backend con migraciones aplicadas.
2. Levantar frontend y navegar al formulario de inscripción.
3. Flujo:
	 - Elegir fecha -> actividad -> horario -> cantidad de personas.
	 - Completar datos por persona (DNI/Edad; Talle cuando aplica: Tirolesa >= 8 años, Palestra >= 12 años).
	 - Aceptar Términos y Condiciones.
	 - Enviar inscripción y ver pantalla de confirmación.


## Pruebas

Las pruebas incluidas (carpeta `Backend/Tests`) usan pytest y hacen requests HTTP contra el backend en ejecución.

Pasos:
1) Backend corriendo en 127.0.0.1:8000
2) En otra terminal:

```bat
cd Backend\Tests
pytest -q
```

Requisitos de test (se instalan con requirements.txt): `pytest`, `requests`.


## Troubleshooting

- CORS/403: asegurate de que `CORS_ALLOWED_ORIGINS` contenga el origen del front y que no exista un proxy intermedio que reescriba el origen.
- Sin actividades: verificá que corriste `python manage.py migrate` (el seed se ejecuta post-migrate) y que la hora del sistema sea correcta.
- Puertos en uso: elegí otros (`runserver 8001`, `--port 5174` en Vite con `npm run dev -- --port 5174`).
- Error de DNI/Edad/Talle: el back valida estrictamente. Revisar mensajes retornados por la API.


## Notas de versión (v1.0.0)

Novedades:
- API pública para actividades e inscripciones.
- Validaciones de negocio (cupos, edad mínima por actividad, talle requerido, TyC).
- UI con validaciones y feedback (toast, acordeón por participante).
- Seed automático de datos.

Breaking changes: N/A

Próximos pasos sugeridos:
- Variables de entorno para URL del backend en el front (Vite env).
- Autenticación y administración de inscripciones.
- Deploy automatizado (CI/CD) y almacenamiento de archivos estáticos.


## Estructura del repo

```
Backend/               # Django
	backInscribirseActividad/
	polls/
	Tests/
Frontend/              # React + Vite
	src/
	public/
```


## Licencia

Uso académico/educativo. Ajustar según las necesidades del proyecto.