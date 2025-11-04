import express from 'express';
import Reserva from '../models/Reserva.js';
import { ensureLoggedIn } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Crear reserva (abierta al cliente)
router.post('/', async (req, res) => {
    const { nombre, email, telefono, fecha, hora, notas } = req.body;
    try {
      const existe = await Reserva.findOne({ fecha: new Date(fecha), hora });
      if (existe) {
        return res.status(400).json({ success: false, error: 'Hora ya reservada para ese día' });
      }
      const reserva = new Reserva({ nombre, email, telefono, fecha: new Date(fecha), hora, notas });
      await reserva.save();
      return res.json({ success: true, reservaId: reserva._id });
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      return res.status(500).json({ success: false, error: 'Error al guardar reserva' });
    }
  });
  
// Obtener días completos (todos los slots ocupados) para un mes o rango
router.get('/dias-completos', async (req, res) => {
    const { mes, año } = req.query;
    const horasPosibles = ['10:00','12:00','14:00','16:00','18:00'];
    const primerosDias = new Date(año, mes-1, 1);
    const últimosDias = new Date(año, mes, 0);
    const reservasMes = await Reserva.find({
      fecha: { $gte: primerosDias, $lte: últimosDias }
    });
    const groupedByDate = {};
    reservasMes.forEach(r => {
      const key = r.fecha.toISOString().split('T')[0];
      if (!groupedByDate[key]) groupedByDate[key] = [];
      groupedByDate[key].push(r.hora);
    });
    const diasCompletos = Object.entries(groupedByDate)
      .filter(([fechaKey, horas]) => horasPosibles.every(h => horas.includes(h)))
      .map(([fechaKey]) => fechaKey);
    return res.json({ success: true, diasCompletos });
  });
  

//todas las libres
router.get('/libres', async (req, res) => {
    const { fecha } = req.query;  // e.g., “2025-11-10”
    const horasPosibles = ['10:00','12:00','14:00','16:00','18:00'];
    const reservasEnFecha = await Reserva.find({ fecha: new Date(fecha) });
    const horasOcupadas = reservasEnFecha.map(r => r.hora);
    const horasLibres = horasPosibles.filter(h => !horasOcupadas.includes(h));
    return res.json({ success: true, horasLibres });
  });
  
  
// Obtener todas las reservas (protegido)
router.get('/', ensureLoggedIn, async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ createdAt: -1 });
    res.json({ reservas });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar reservas' });
  }
});

// Eliminar reserva por ID (protegido)
router.delete('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByIdAndDelete(id);

    if (!reserva) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
    }

    return res.json({ success: true, message: 'Reserva eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar reserva:', err);
    return res.status(500).json({ success: false, error: 'Error al eliminar reserva' });
  }
});


export default router;
