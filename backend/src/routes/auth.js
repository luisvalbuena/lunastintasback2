import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const router = express.Router();

router.get('/session', (req, res) => {
  if (req.session && req.session.admin) {
    res.json({ success: true, admin: req.session.admin });
  } else {
    res.status(401).json({ success: false, admin: null });
  }
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_HASH;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
  }

  req.session.admin = { username: ADMIN_USERNAME };
  return res.json({ success: true, admin: { username: ADMIN_USERNAME } });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ success: true });
  });
});

export default router;
