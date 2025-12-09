const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Aquí se agregan las rutas principales
app.use('/api', routes);

// Middleware de manejo de errores básico
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;