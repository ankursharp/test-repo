# Advanced Web Threats II (Spring Boot)
### This web application is intentionally vulnerable; once up and running, open up *Burp Suite* and write a security report

## Application Requirements 
**Backend** - Spring Boot, Postgresql, JDBC

**Frontend** - React, Node.js (built and served with Nginx)

**Everything runs easy in** – Docker
## Admin Access
- Log in as superadmin@email.com : admin123
## Base User
- Register with any username, email, and password
# Project Structure

dvelupmint/
- backend/<br />
   ├── src/<br />
   ├── target/<br />
   ├── Dockerfile<br />
   └── pom.xml
- frontend/<br />
   ├── node_modules/<br />
   ├── public/<br />
   ├── src/<br />
   ├── Dockerfile<br />
   ├── nginx.conf<br />
   └── package.json<br />

├── .env.example                *← Copy to .env and fill values*<br />
├── docker-compose.yml<br />
└── README.md

## Quick Start (Docker)

1. Clone the repository
   ```bash
   git clone https://github.com/d-velopr/vuln-springboot-app.git

   cd vuln-springboot-app
2. Copy and adjust environment variables
    ```bash
    cp .env.example .env

    # edit .env
    APP_NAME=dvelupmint
    # Database
    DB_PASSWORD={Your-Database-Password}
    DB_NAME={Your-Database-Name}
    # JWT (A 33+ char. random string that is base 64 encoded)
    JWT_SECRET={Generate-A-Long-Random-Base-64-Encoded-Key}
    # Spring
    SPRING_PROFILES_ACTIVE=dev
3. Start everything with one command
    ```bash
    docker compose up -d --build
## Open in browser:

Frontend → http://localhost:3000

Backend API → http://localhost:8080/api/…

(optional) pgAdmin → http://localhost:5050 (if enabled)

# Shutdown Gracefully
```bash
docker compose down