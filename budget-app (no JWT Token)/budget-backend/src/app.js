require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const optionRoutes = require('./routes/option.routes');
const planRoutes = require('./routes/plan.routes');

const app = express();

app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/options', optionRoutes);
app.use('/api/plans', planRoutes);

// Error 404 por defecto
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
