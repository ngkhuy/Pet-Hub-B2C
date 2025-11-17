**Project Overview**

- **Repository:** Pet-Hub-B2B — a small microservices example for a pet services platform (authentication, booking, user/profile management) with a Next.js front-end.

**Repository Structure**

- **`auth-service/`**: FastAPI service that handles authentication and token logic. Exposes `/api/auth` and `/api/internal` routers.
- **`booking-service/`**: FastAPI service for booking-related endpoints (care, hotel). Exposes `/api/booking` routes.
- **`user-management-service/`**: FastAPI service that manages user profiles and pets. Exposes `/api/ums`, `/api/ums/admin` and `/api/internal` routes. Provides a `/health` endpoint.
- **`front-end/`**: Next.js application (React) for the web UI.

**Services (high level)**

- **Auth Service** (`auth-service`): FastAPI app (see `auth-service/main.py`). CORS is configured for `http://localhost:3000` by default.
- **Booking Service** (`booking-service`): FastAPI app (see `booking-service/main.py`).
- **User Management Service** (`user-management-service`): FastAPI app (see `user-management-service/main.py`). CORS is also configured for `http://localhost:3000`.

All Python services use `pydantic` / `pydantic-settings` style `Settings` models (look under `*/core/config.py`) and expect environment variables typically defined in a `.env` file in the service root.

**Quick Start — Python services**
Prerequisites: Python 3.10+ recommended, and `pip`.

- Create and activate a virtual environment (Windows `cmd`):

```
python -m venv .venv
.venv\Scripts\activate
```

- Install dependencies (example). Some services include `requirements.txt` (e.g., `booking-service/requirements.txt`):

```
cd booking-service
pip install -r requirements.txt
cd ..

# For services without a requirements file (install common deps):
pip install fastapi uvicorn python-dotenv pydantic-settings
```

- Run a service (from that service folder):

```
cd auth-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001

cd ..
cd user-management-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8002

cd ..
cd booking-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8003
```

Notes:

- Run `python -m uvicorn main:app` from the service directory (so the module path resolves correctly). Adjust ports as needed.
- If you use Docker, you can containerize each service and set env vars via environment or `--env-file`.

**Front-end (Next.js)**

- Prerequisites: Node.js 18+ recommended.
- Install and run:

```
cd front-end
npm install
npm run dev
```

The front-end expects the API services to be available (usually at `http://localhost:<port>`). By default CORS settings in services allow `http://localhost:3000`.

**Environment variables**
Create a `.env` file inside each service directory and set the required variables. The `Settings` models (in `*/core/config.py`) define the expected keys — examples below.

- Auth service (`auth-service/.env`) — required keys (example):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/authdb
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_ENV=development
USER_SERVICE_INTERNAL_BASE_URL=http://localhost:8002
```

- Booking service (`booking-service/.env`) — required keys (example):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/bookingdb
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

- User Management service (`user-management-service/.env`) — required keys (example):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/umsdb
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
MAIL_USERNAME=postman@example.com
MAIL_PASSWORD=supersecret
MAIL_FROM=no-reply@example.com
MAIL_PORT=587
MAIL_SERVER=smtp.example.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
AUTH_SERVICE_INTERNAL_BASE_URL=http://localhost:8001
APP_ENV=development
```

Adjust values to match your environment and the mail provider you use.

**API routes (quick reference)**

- Auth service: root `/` and routers under `/api/auth` and `/api/internal` (see `auth-service/main.py`).
- Booking service: root `/` and routes under `/api/booking` (see `booking-service/main.py`).
- User Management service: root `/health`, internal endpoints under `/api/internal`, user endpoints under `/api/ums` and admin endpoints under `/api/ums/admin` (see `user-management-service/main.py`).

**Testing & Development tips**

- Use `curl` or HTTP clients (Postman, HTTPie) to exercise endpoints. Example health check:

```
curl http://localhost:8002/health
```

- When developing, run each FastAPI service with `--reload` so changes are auto-reloaded.

**Contributing**

- Keep changes scoped to a single service per PR.
- Document any new environment variables and update this README or the service's README.

**Notes & Next Steps**

- Service READMEs exist (e.g., `auth-service/README.md`, `user-management-service/README.md`) but are currently placeholders — consider adding service-specific setup, endpoints, and DB migration instructions there.
- Consider adding a top-level `docker-compose.yml` for local orchestration (Postgres + services + front-end) if you want an easy local dev environment.

**Contact / Maintainers**

- Repository owner: `ngkhuy` (branch `user-management-service` currently checked out).

---

If you'd like, I can:

- generate example `.env.sample` files for each service,
- add a `docker-compose.yml` for local development, or
- scaffold basic `requirements.txt` files for the Python services.
  Tell me which you'd prefer and I'll add them.
