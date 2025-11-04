import mongoose from 'mongoose';

const ReservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  notas: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Reserva = mongoose.model('Reserva', ReservaSchema);
export default Reserva;
