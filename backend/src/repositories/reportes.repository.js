const { getPool, sql } = require('../db/sqlserver');

async function getExpedientesPorEstado({ fechaDesde, fechaHasta }) {
  const pool = await getPool();
  const request = pool.request();

  if (fechaDesde) {
    request.input('fechaDesde', sql.DateTime, fechaDesde);
  } else {
    request.input('fechaDesde', sql.DateTime, null);
  }

  if (fechaHasta) {
    request.input('fechaHasta', sql.DateTime, fechaHasta);
  } else {
    request.input('fechaHasta', sql.DateTime, null);
  }

  const result = await request.execute('sp_ReporteExpedientesPorEstado');
  return result.recordset;
}

module.exports = {
  getExpedientesPorEstado,
};