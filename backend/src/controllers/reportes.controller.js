const service = require('../services/reportes.service');

async function expedientesPorEstado(req, res, next) {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    const data = await service.reporteExpedientesPorEstado({
      fechaDesde,
      fechaHasta,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  expedientesPorEstado,
};