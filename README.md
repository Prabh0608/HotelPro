# HotelPro

HotelPro is a full-stack hotel room booking and management application. Guests can browse rooms, submit a reservation, and manage their bookings. Admins can manage room inventory and review and update reservations and registered users.

## Features

### Guest experience

- Create an account and sign in.
- Browse room listings with photos, descriptions, capacity, and nightly rates.
- Select check-in and check-out dates and see the total stay price calculated from the room rate and number of nights.
- Submit a booking through the demo checkout form.
- View personal bookings and cancel an active booking.

### Admin dashboard

- Review all bookings, including guest, stay dates, phone number, amount, and booking status.
- Edit a booking's dates and status. The server validates the dates and recalculates the number of nights and total price using the room rate.
- Cancel bookings.
- View room inventory and add rooms with capacity, rate, type, description, and photo URLs.
- View registered users and their account types.

### Demo data

- The optional seed script creates an admin account, a customer account, three sample rooms, and three sample bookings (two upcoming and one cancelled).
- The sample booking dates are generated relative to the day the seed script runs.
- Seeding is repeatable and limited to demo records. It will not delete unrelated records.

## Technology

- **Frontend:** React, Vite, React Router, React Bootstrap, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** bcrypt password hashing and JSON Web Tokens (JWT)

## Run locally

### Prerequisites

- Node.js and npm
- MongoDB Community Server running locally

### 1. Get the code

```powershell
git clone https://github.com/avnipatidar06/HotelPro.git
cd HotelPro
```

### 2. Configure and start the backend

In a terminal:

```powershell
cd server
npm install
```

Create `server/.env` with the following values. Replace the JWT secret with a long, random value, even for local use.

```env
PORT=8001
MONGO_URI=mongodb://127.0.0.1:27017/Roomly
JWT_SECRET=replace-with-a-long-random-secret
```

Start the API:

```powershell
npx nodemon index.js
```

The API listens on `http://localhost:8001`.

### 3. (Optional) Seed demo accounts, rooms, and bookings

With MongoDB running and `server/.env` configured to use the local `Roomly` database, open a terminal at the project root and run:

```powershell
npm --prefix server run seed:demo
```

The script requires `MONGO_URI` to point to a local MongoDB host and the exact database name `Roomly`. It exits without seeding if those checks fail.

To seed the configured MongoDB Atlas database, use the explicit Atlas confirmation flag from the `server` directory. The current connection string is used as-is, so Atlas will use its configured database (or its default database when no database name is included):

```powershell
node scripts/seedDemoData.js --confirm-atlas
```

Atlas seeding creates only the demo users, rooms, and bookings described above. Room photos remain hosted image URLs; the project does not upload local image files to MongoDB.

#### Demo sign-in credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hotelpro.test` | `HotelProDemo!2026` |
| Customer | `guest@hotelpro.test` | `HotelProDemo!2026` |

Use these credentials only in your local demo environment. Re-running the seed script refreshes these demo accounts and upserts the sample demo records.

### 4. Start the frontend

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Important demo limitations

- Checkout is a mock flow: HotelPro does not process payments. **Never enter real card details.** The current booking API stores the card fields submitted through the demo form with the booking record; use fictional values only and keep the database local.
- This project is intended for local demonstration, not production deployment. Signup currently allows selecting the Admin role, and not every API endpoint enforces authorization. Do not expose this app or its demo credentials to a public network without first implementing appropriate server-side access controls and payment-data handling.

## Project layout

```text
client/   React frontend
server/   Express API, MongoDB models, and demo data seeder
```
