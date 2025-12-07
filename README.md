# 🐾 Pet-Hub-B2C

> Nền tảng quản lý dịch vụ thú cưng toàn diện với kiến trúc microservices

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [API Documentation](#-api-documentation)
- [Đóng góp](#-đóng-góp)

## 🎯 Tổng quan

**Pet-Hub-B2C** là một nền tảng quản lý dịch vụ thú cưng được xây dựng theo kiến trúc microservices, cung cấp các tính năng:

- 🔐 **Xác thực và phân quyền** - Đăng ký, đăng nhập, quản lý token JWT
- 👤 **Quản lý người dùng** - Profile người dùng, quản lý thú cưng, xác thực email OTP
- 📅 **Đặt lịch dịch vụ** - Spa, khách sạn thú cưng
- 🏥 **Đặt hẹn bác sĩ thú y** - Quản lý lịch hẹn khám chữa bệnh
- 💻 **Giao diện web hiện đại** - Next.js với React 19 và TailwindCSS

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│   Front-end     │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
┌─────────────────┐                      ┌─────────────────┐
│  Auth Service   │◄────────────────────►│  User Mgmt      │
│  Port: 8000     │   Internal S2S       │  Service        │
└────────┬────────┘                      │  Port: 8001     │
         │                               └────────┬────────┘
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│ Booking Service │                      │  VET Service    │
│  Port: 8002     │                      │  Port: 8003     │
└─────────────────┘                      └─────────────────┘
```

### Microservices

| Service | Port | Mô tả | Database |
|---------|------|-------|----------|
| **Auth Service** | 8000 | Xác thực, JWT, quản lý token | PostgreSQL |
| **User Management** | 8001 | Profile, pets, email OTP | PostgreSQL |
| **Booking Service** | 8002 | Đặt lịch spa, hotel | PostgreSQL |
| **VET Service** | 8003 | Đặt hẹn bác sĩ thú y | PostgreSQL |
| **Front-end** | 3000 | Web UI (Next.js) | - |

## 🛠️ Công nghệ sử dụng

### Backend (Python Services)
- **Framework**: FastAPI
- **ORM**: SQLModel + SQLAlchemy
- **Database**: PostgreSQL (asyncpg driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: pwdlib
- **Email**: fastapi-mail
- **HTTP Client**: httpx (internal communication)
- **Server**: Uvicorn

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Form**: TanStack Form + Zod
- **Authentication**: NextAuth v5
- **Animation**: Motion (Framer Motion)

### DevOps
- **Containerization**: Docker
- **Database**: PostgreSQL
- **Environment**: python-dotenv, pydantic-settings

## 📁 Cấu trúc thư mục

```
Pet-Hub-B2C/
├── auth-service/              # Service xác thực
│   ├── core/                  # Security, config, internal client
│   ├── crud/                  # Database operations
│   ├── routers/               # API endpoints
│   ├── dependency/            # Dependencies & middleware
│   ├── models.py              # Database models
│   ├── database.py            # Database connection
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── user-management-service/   # Service quản lý user & pets
│   ├── core/                  # Security, config, email, S2S
│   ├── crud/                  # Database operations
│   ├── route/                 # API endpoints
│   ├── dependency/            # Dependencies & middleware
│   ├── models.py              # Database models
│   ├── database.py            # Database connection
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── booking-service/           # Service đặt lịch spa, hotel
│   ├── core/                  # Security, config
│   ├── crud/                  # Database operations
│   ├── routers/               # API endpoints
│   ├── dependency/            # Dependencies & middleware
│   ├── models.py              # Database models
│   ├── database.py            # Database connection
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── vet-service/               # Service đặt hẹn bác sĩ
│   ├── core/                  # Security, config
│   ├── crud/                  # Database operations
│   ├── routers/               # API endpoints
│   ├── dependency/            # Dependencies & middleware
│   ├── models.py              # Database models
│   ├── database.py            # Database connection
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── front-end/                 # Next.js web application
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & helpers
│   │   └── stores/            # Zustand stores
│   ├── package.json           # Node dependencies
│   ├── .env                   # Environment variables
│   └── .env.local             # Local overrides
│
└── README.md                  # Documentation
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- **Python**: 3.10+ 
- **Node.js**: 18+
- **PostgreSQL**: 14+
- **Docker** (optional): 20+

### Option 1: Chạy với Docker (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/ngkhuy/Pet-Hub-B2C.git
cd Pet-Hub-B2C

# TODO: Tạo docker-compose.yml để chạy tất cả services
# docker-compose up -d
```

### Option 2: Chạy thủ công

#### Backend Services

**1. Tạo virtual environment (khuyến nghị)**

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

**2. Cài đặt và chạy từng service**

```bash
# Auth Service
cd auth-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001

# User Management Service (terminal mới)
cd user-management-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8002

# Booking Service (terminal mới)
cd booking-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8003

# VET Service (terminal mới)
cd vet-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8004
```

#### Frontend

```bash
cd front-end
npm install
npm run dev
```

Truy cập: **http://127.0.0.1:3000**

## ⚙️ Cấu hình môi trường

### Auth Service (`.env`)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/auth_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Environment
APP_ENV=development

# Internal Services
USER_SERVICE_INTERNAL_BASE_URL=http://127.0.0.1:8002
```

### User Management Service (`.env`)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/user_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@pethub.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False

# Internal Services
AUTH_SERVICE_INTERNAL_BASE_URL=http://127.0.0.1:8001

# Environment
APP_ENV=development
```

### Booking Service (`.env`)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/booking_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### VET Service (`.env`)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/vet_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Front-end (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://127.0.0.1:3000
```

## 📚 API Documentation

Khi các service đang chạy, truy cập Swagger UI:

- **Auth Service**: http://127.0.0.1:8001/docs
- **User Management**: http://127.0.0.1:8002/docs
- **Booking Service**: http://127.0.0.1:8003/docs
- **VET Service**: http://127.0.0.1:8004/docs

### API Endpoints Overview

#### Auth Service (`/api/auth`)
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất

#### User Management (`/api/ums`)
- `GET /api/ums/me` - Lấy thông tin user
- `PATCH /api/ums/me` - Cập nhật profile
- `GET /api/ums/pets` - Danh sách thú cưng
- `POST /api/ums/pets` - Thêm thú cưng
- `POST /api/ums/request-otp` - Yêu cầu OTP
- `POST /api/ums/verify-otp` - Xác thực OTP

#### Booking Service (`/api/booking`)
- `GET /api/booking/services` - Danh sách dịch vụ
- `POST /api/booking/care` - Đặt lịch spa
- `POST /api/booking/hotel` - Đặt phòng hotel
- `GET /api/booking/my-bookings` - Lịch sử đặt

#### VET Service (`/api/vet`)
- `GET /api/vet/appointments` - Danh sách lịch hẹn
- `POST /api/vet/appointments` - Đặt hẹn mới
- `PATCH /api/vet/appointments/{id}` - Cập nhật lịch hẹn

## 🧪 Testing

```bash
# Health check
curl http://127.0.0.1:8002/health

# Test auth service
curl http://127.0.0.1:8001/

# Test booking service
curl http://127.0.0.1:8003/
```

## 🐳 Docker Support

Mỗi service có thể chạy độc lập trong Docker container:

```dockerfile
# Example Dockerfile cho Python service
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Quy tắc đóng góp

- Mỗi PR chỉ nên thay đổi một service
- Cập nhật README khi thêm biến môi trường mới
- Viết docstring cho các function quan trọng
- Test kỹ trước khi tạo PR

## 📝 License

Dự án này thuộc về **ngkhuy**. Vui lòng liên hệ để biết thêm thông tin về license.

## 👥 Maintainers

- **Repository Owner**: [@ngkhuy](https://github.com/ngkhuy)

## 🔮 Roadmap

- [ ] Thêm Docker Compose cho toàn bộ hệ thống
- [ ] Implement CI/CD pipeline
- [ ] Thêm unit tests và integration tests
- [ ] Thêm monitoring và logging (Prometheus, Grafana)
- [ ] Implement caching với Redis
- [ ] Thêm API Gateway (Kong/Nginx)
- [ ] Implement message queue (RabbitMQ/Kafka)
- [ ] Mobile app (React Native)

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue hoặc liên hệ qua email.

---

**Made with ❤️ for pet lovers**
