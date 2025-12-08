# 🐾 PetHub - Comprehensive Pet Care Platform

**[🌐 Visit our Website](https://pethub-mu.vercel.app/)**

PetHub is a modern, microservices-based application designed to streamline pet care services including veterinary appointments, spa bookings, pet hotels, and adoption services. Built with scalability and performance in mind, it leverages **Next.js** for a dynamic frontend and **FastAPI** for robust backend services.

---

## 🚀 Features

*   **User Management:** Secure authentication and profile management utilizing JWT.
*   **Booking System:** Easy scheduling for vet visits and spa services.
*   **Vet Services:** Directory and management of veterinary professionals.
*   **Microservices Architecture:** Independently scalable services for Auth, Users, Booking, and Vets.
*   **Modern UI/UX:** Responsive design powered by Tailwind CSS and Shadcn/UI.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
*   **State Management:** Zustand
*   **Forms:** React Hook Form + Zod

### Backend Services
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Database ORM:** SQLModel / SQLAlchemy
*   **Database:** PostgreSQL (Supabase)
*   **Authentication:** OAuth2 with JWT (python-jose, pwdlib)

### DevOps & Infrastructure
*   **Containerization:** Docker & Docker Compose
*   **Deployment:** Render (Blueprints)
*   **CI/CD:** GitHub Actions (ready for integration)

---

## 📂 Project Structure

```bash
Pet-Hub-B2C/
├── front-end/                # Next.js Frontend Application
├── auth-service/             # Authentication Service (FastAPI)
├── user-management-service/  # User Profile & Management Service
├── booking-service/          # Appointment Booking Service
├── vet-service/              # Veterinary Service Management
├── compose.yml               # Docker Compose for Local Development
└── render.yaml               # Render Deployment Blueprint
```

---

## 🏁 Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js 20+ (for local frontend dev)
*   Python 3.11+ (for local backend dev)

### 🐳 Run with Docker (Recommended)

Quickly start the entire system with Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/ngkhuy/Pet-Hub-B2C.git
cd Pet-Hub-B2C

# 2. Start all services
docker compose up --build
```

Access the application at: `http://localhost:3000`

### 🔧 Environment Variables

Each service requires specific environment variables.  
Refer to `compose.yml` for the standard configuration or create `.env` files in each service directory based on their requirements.

---

## ☁️ Deployment

This project is configured for seamless deployment on **[Render](https://render.com/)**.

1.  Push your code to a GitHub repository.
2.  Log in to Render and go to **Blueprints**.
3.  Click **New Blueprint Instance** and connect your repository.
4.  Render will automatically detect `render.yaml` and configure:
    *   **Frontend Service** (Docker/Node)
    *   **4 Backend Services** (Docker/Python)
    *   **Private Network** for internal service communication.
5.  **Post-Deployment:** Update `NEXT_PUBLIC_URL` and API variables in the Render Dashboard to match your generated domains.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
