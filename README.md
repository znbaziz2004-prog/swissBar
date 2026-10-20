# Swiss Barber

One project · **one backend** (Express) · **one database** (`swiss`, MySQL).

```
swiss/
├── backend/            Express API (port 5000) – the ONLY backend, uses DB "swiss"
├── database/swiss.sql  Main DB dump (import this)
├── website/            Public Laravel site (port 8000) – calls the backend API
└── panels/
    ├── admin/          Super-admin panel (React, port 5173)
    └── customer/       Customer portal (React, port 5174)
```

## Setup
1. Create the database and import it: `mysql -u root -e "CREATE DATABASE IF NOT EXISTS swiss"` then `mysql -u root swiss < database/swiss.sql`
2. Install everything: `npm run install:all` (and run `composer install` inside `website/` if `vendor/` is missing)
3. Start everything: `npm run dev`

| App | URL |
|---|---|
| API | http://localhost:5000/api |
| Website | http://localhost:8000 |
| Admin panel | http://localhost:5173/admin/login |
| Customer portal | http://localhost:5174/customer/login |

DB settings live in `backend/.env` (`DB_NAME=swiss`). Every frontend uses `VITE_API_URL=http://localhost:5000/api`.
