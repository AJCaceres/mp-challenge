const repo = require('../repositories/reportes.repository');

function parseFecha(fechaStr) {
  if (!fechaStr) return null;
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return null;
  return d;
}

async function reporteExpedientesPorEstado({ fechaDesde, fechaHasta }) {
  const fechaDesdeParsed = parseFecha(fechaDesde);
  const fechaHastaParsed = parseFecha(fechaHasta);

  return await repo.getExpedientesPorEstado({
    fechaDesde: fechaDesdeParsed,
    fechaHasta: fechaHastaParsed,
  });
}

module.exports = {
  reporteExpedientesPorEstado,
};