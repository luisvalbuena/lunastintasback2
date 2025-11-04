import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import reservasRoutes from './routes/reservas.js';
import autoRoutes from './routes/auto.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();  // Si usas top-level await (Node 14+ con ES modules) o bien envuelve en una función async.

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,       // ✅ cookies solo HTTPS en prod
      sameSite: isProd ? "none" : "lax", // ✅ permitir cross-domain
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/auto',autoRoutes)

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
