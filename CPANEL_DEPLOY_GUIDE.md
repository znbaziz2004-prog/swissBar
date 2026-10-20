# Swiss Barber – cPanel Live Deployment Guide

This guide ensures your application runs smoothly on **`https://swiss.daydoenterprises.us`** without any `503 Service Unavailable`, `404 Not Found`, or `403 Forbidden` errors.

---

## 1. Directory & Archive Extraction

1. In cPanel **File Manager**, navigate to the document root folder for your subdomain:
   - Path: `/home/YOUR_USER/swiss.daydoenterprises.us` (or `/home/YOUR_USER/public_html/swiss.daydoenterprises.us`)
2. Upload `swiss_cpanel_production.tar.gz`.
3. Right-click the uploaded file and select **Extract**.
4. Make sure all extracted files live directly inside the subdomain root:
   ```text
   swiss.daydoenterprises.us/
   ├── .env
   ├── .env.example
   ├── .htaccess               <-- Multi-tier routing & SPA handler
   ├── app.js                  <-- Node.js startup file
   ├── package.json            <-- Root Node configuration
   ├── backend/                <-- Express API with pre-installed node_modules
   ├── database/swiss.sql      <-- Database schema & initial data
   ├── public/                 <-- Laravel entrypoint + Admin & Customer React SPAs
   ├── website/                <-- Laravel website backend & Blade views
   └── panels/                 <-- Source panels for reference
   ```

---

## 2. cPanel Node.js Application Settings

In cPanel under **Software** → **Setup Node.js App**:

| Setting | Value |
|---|---|
| **Node.js Version** | `20.x` or `22.x` (or `24.x`) |
| **Application Mode** | `Production` |
| **Application Root** | `swiss.daydoenterprises.us` |
| **Application URL** | `swiss.daydoenterprises.us` / `api` |
| **Application Startup File** | `app.js` |

> [!IMPORTANT]
> **Why 503 error occurred and how it is fixed:**
> 1. Previously, `.htaccess` attempted to proxy `/api` via `mod_proxy` to `http://127.0.0.1:5000`. On cPanel shared hosting, Apache cannot connect to port 5000 directly, which generated the Apache 503 error.
> 2. Node.js on cPanel is managed by **Phusion Passenger**. The code has now been updated so `app.listen('passenger')` binds immediately to the Passenger IPC channel without awaiting database connections, and the faulty port 5000 proxy rule has been removed from `.htaccess`.
> 3. After uploading & extracting `swiss_cpanel_production.tar.gz`, open **Setup Node.js App** in cPanel and click **RESTART** (or click edit and **SAVE**) so cPanel writes its Passenger configuration to `.htaccess`.

---

## 3. MySQL Database Setup

1. In cPanel, open **MySQL Database Wizard**.
2. Create a new database, e.g. `daydoent_swiss`.
3. Create a new user, e.g. `daydoent_barber`, and assign a strong password.
4. Grant **ALL PRIVILEGES** to this user for the database.
5. In cPanel, open **phpMyAdmin**, click your new database, and click the **Import** tab.
6. Select and upload the file: `database/swiss.sql`.

---

## 4. Configure Database Credentials (.env)

Open `.env` (in root) and `backend/.env` using the cPanel File Manager **Edit** feature:

```env
PORT=5000
NODE_ENV=production

JWT_SECRET=THE_Barber_secret
DB_HOST=127.0.0.1
DB_USER=daydoent_barber
DB_PASSWORD=YOUR_CPANEL_PASSWORD
DB_NAME=daydoent_swiss
DB_PORT=3306

APP_URL=https://swiss.daydoenterprises.us
ADMIN_PANEL_URL=https://swiss.daydoenterprises.us
CUSTOMER_DASHBOARD_URL=https://swiss.daydoenterprises.us/customer/login
CUSTOMER_PANEL_URL=https://swiss.daydoenterprises.us
```

> [!TIP]
> After modifying `.env`, go to **Setup Node.js App** in cPanel and click **RESTART**.

---

## 5. Verification & Live URLs

Once extracted and configured, verify each endpoint:

| Feature | URL | Expected Result |
|---|---|---|
| **Backend Health Check** | `https://swiss.daydoenterprises.us/api/health` | HTTP 200 JSON (`{"status":"healthy","database":{"status":"connected"}}`) |
| **Database Connection** | `https://swiss.daydoenterprises.us/api/test-db` | HTTP 200 JSON (`{"message":"MySQL database is connected"}`) |
| **Main Website** | `https://swiss.daydoenterprises.us` | Public website homepage |
| **Super Admin Panel** | `https://swiss.daydoenterprises.us/admin` | React Admin Console |
| **Admin Login** | `https://swiss.daydoenterprises.us/admin/login` | React Admin Login SPA (no 404 on refresh) |
| **Customer Portal** | `https://swiss.daydoenterprises.us/customer` | React Customer Portal |
| **Customer Login** | `https://swiss.daydoenterprises.us/customer/login` | React Customer Login SPA (no 404 on refresh) |
| **Barber Panel** | `https://swiss.daydoenterprises.us/barber` | React Barber Management Panel |
| **Barber Login** | `https://swiss.daydoenterprises.us/barber/login` | React Barber Login SPA (no 404 on refresh) |

---

## 6. Route & Permission Architecture

- **Zero 503 Crashes:** The Node startup script (`backend/src/server.js`) tests MySQL gracefully without terminating the process (`process.exit`), keeping the HTTP listener active at all times.
- **Dual Mount Routing:** All Express routes respond to both `/api/*` and direct `/*` paths, completely preventing Passenger `PassengerBaseURI` stripping 404 errors.
- **Clean SPA History Routing:** Apache `.htaccess` ensures refreshing `/admin/dashboard` or `/customer/appointments` serves `index.html` with status 200 instead of a 404.
- **Same-Origin API:** Built assets now query relative `/api`, eliminating all CORS, port 5000 connection refused, and mixed-content SSL errors.
