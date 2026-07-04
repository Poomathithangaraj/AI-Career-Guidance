# Production Deployment Guide

This guide details how to host the AI Career Guidance Agent in a production-ready cloud environment.

## 1. Production Database Setup (MySQL)
By default, the platform runs SQLite. For production workloads, link to a MySQL instance:
1. Spin up a MySQL Server database.
2. Create schema tables using `database/schema.sql` or configure credentials directly inside your environment:
   ```env
   DATABASE_URL=mysql+pymysql://db_user:db_password@host:3306/db_name
   ```
3. Run the migrations/seeder inside your production console to populate questions:
   ```bash
   python database/seed_data.py
   ```

---

## 2. API Backend Deployment (FastAPI + Gunicorn)
We recommend running Uvicorn workers managed by Gunicorn inside a Linux (Ubuntu) environment shielded by an Nginx reverse proxy.

1. Install Gunicorn and Uvicorn inside production virtual environments:
   ```bash
   pip install gunicorn uvicorn
   ```

2. Run Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
   ```

3. Setup Nginx site configuration to proxy requests:
   ```nginx
   server {
       listen 80;
       server_name api.careercompass.ai;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## 3. Frontend Deployment (Vite + React Static Build)
Since React compiles down to static HTML, CSS, and JS assets:

1. Compile production build outputs:
   ```bash
   cd frontend
   npm run build
   ```
   This generates assets in the `frontend/dist` directory.

2. Host `dist` using Nginx configurations or push directly to platforms like Vercel, Netlify, or AWS S3.
   Example Nginx configurations:
   ```nginx
   server {
       listen 80;
       server_name careercompass.ai;
       root /var/www/careercompass/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
