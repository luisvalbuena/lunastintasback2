import express from 'express';
import Auto from '../models/Auto.js';
import { ensureLoggedIn } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Crear solicitud de carta astral (abierto al cliente)
router.post('/', async (req, res) => {
  const {
    nombre,
    fechaNacimiento,
    horaNacimiento,
    ciudadNacimiento,
    paisNacimiento,
    email,
    notas
  } = req.body;

  try {
    // Validación mínima
    if (!fechaNacimiento || !horaNacimiento || !ciudadNacimiento || !paisNacimiento) {
      return res.status(400).json({
        success: false,
        error: 'Los campos fechaNacimiento, horaNacimiento, ciudadNacimiento y paisNacimiento son obligatorios'
      });
    }

    const nuevaSolicitud = new Auto({
      nombre,
      fechaNacimiento,
      horaNacimiento,
      ciudadNacimiento,
      paisNacimiento,
      email,
      notas
    });

    await nuevaSolicitud.save();

    return res.json({
      success: true,
      requestId: nuevaSolicitud._id,
      message: 'Solicitud de carta astral recibida'
    });
  } catch (err) {
    console.error('Error al guardar solicitud de carta astral:', err);
    return res.status(500).json({ success: false, error: 'Error al guardar la solicitud' });
  }
});

// Obtener todas las solicitudes (protegido)
router.get('/', ensureLoggedIn, async (req, res) => {
  try {
    const autos = await Auto.find().sort({ createdAt: -1 });
    return res.json({ autos });
  } catch (err) {
    console.error('Error cargando solicitudes:', err);
    res.status(500).json({ error: 'Error al cargar solicitudes' });
  }
});

// Eliminar solicitud por ID (protegido)
router.delete('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Auto.findByIdAndDelete(id);

    if (!solicitud) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    return res.json({ success: true, message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar solicitud:', err);
    return res.status(500).json({ success: false, error: 'Error al eliminar la solicitud' });
  }
});

export default router;
