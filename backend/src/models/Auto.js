import mongoose from 'mongoose';

const AutoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: false
    },
    fechaNacimiento: {
      type: String, // Guardamos la fecha en formato texto enviado por el usuario
      required: true
    },
    horaNacimiento: {
      type: String, // Ej: "03:25"
      required: true
    },
    ciudadNacimiento: {
      type: String,
      required: true,
      trim: true
    },
    paisNacimiento: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    notas: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Auto', AutoSchema);
