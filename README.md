# Pimp Your Grill
# Prunescu Allysia Georgiana

## Descrierea aplicației

Pimp Your Grill este o aplicație web.
Aplicația permite utilizatorilor să posteze grătare, să voteze cele mai
bune grătare (sistem MIC -- like/unlike), să caute, să filtreze și să
gestioneze grătarele proprii.

Backend: Node.js + Express + MongoDB\
Frontend: React + Vite

## Instalare & Rulare

### 1. Clonează proiectul

    git clone https://github.com/<USERNAME>/pimp-your-grill
    cd pimp-your-grill

### 2. Backend

    cd backend
    npm install
    npm start

Creează un fișier `.env` în folderul backend:

    PORT=3001
    MONGO_URI=mongodb://127.0.0.1:27017/pimp-your-grill
    JWT_SECRET=supersecret123

### 3. Frontend

    cd frontend
    npm install
    npm run dev

Frontend rulează pe: http://localhost:5173\
Backend rulează pe: http://localhost:3001

## Funcționalități implementate

### ✔️ Homepage + Navbar + Footer

-   Navbar dinamic (Login/Register sau Profile/Logout)
-   Responsive & functional

### ✔️ Register & Login

-   Validări la formular
-   Salvare token în localStorage
-   Redirect automat după înregistrare sau login
-   Endpoint-uri:
    -   `POST /api/auth/register`
    -   `POST /api/auth/login`
    -   `GET /api/auth/me`

### ✔️ Profile Page

-   Afișare date utilizator
-   Listare grătare proprii
-   Adăugare grill

### ✔️ Adding New Grill

-   Form cu validări
-   Persistență în DB
-   Endpoint:
    -   `POST /api/grills`

### ✔️ Best Grills Page

-   Search după nume/descriere
-   Sortare: cele mai noi / cele mai apreciate
-   Leaderboard cu top 3/5 grătare
-   Modal detalii grill

### ✔️ MIC System (Like/Unlike)

-   Toggle like/unlike
-   Actualizare instant în UI
-   Endpoint:
    -   `POST /api/grills/:id/like`

### ✔️ Searching & Filtering

-   `GET /api/grills?q=term&sort=new|top`

## Teste efectuate

-   Register/Login → OK
-   Protected routes → OK
-   Adăugare grill → OK
-   Like system → OK
-   Search + sort → OK
-   Leaderboard → OK

## Ce am învățat

-   Arhitectură REST backend
-   JWT authentication & protected routes
-   React Context pentru state global
-   Modaluri, carduri, componente reutilizabile
-   Integrare completă frontend-backend
-   Adaptare UI după design Figma
