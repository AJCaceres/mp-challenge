const { getPool, sql } = require('../db/sqlserver');

async function crearExpediente({ numeroExpediente, idTecnico }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('numeroExpediente', sql.NVarChar(50), numeroExpediente)
    .input('idTecnicoRegistro', sql.Int, idTecnico)
    .execute('sp_CrearExpediente');

  return result.recordset[0];
}

async function actualizarExpediente({ idExpediente, numeroExpediente }) {
  const pool = await getPool();
  await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .input('numeroExpediente', sql.NVarChar(50), numeroExpediente)
    .execute('sp_ActualizarExpediente');
}

async function obtenerExpedientes({ estado, fechaDesde, fechaHasta }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('estado', sql.NVarChar(20), estado)
    .input('fechaDesde', sql.DateTime, fechaDesde)
    .input('fechaHasta', sql.DateTime, fechaHasta)
    .execute('sp_ObtenerExpedientes');

  return result.recordset;
}

async function eliminarExpediente(idExpediente) {
  const pool = await getPool();
  await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .execute('sp_EliminarExpediente');
}

async function enviarRevision(idExpediente) {
  const pool = await getPool();
  await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .execute('sp_EnviarRevision');
}

async function aprobarExpediente(idExpediente, idCoordinador) {
  const pool = await getPool();
  await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .input('idCoordinador', sql.Int, idCoordinador)
    .execute('sp_AprobarExpediente');
}

async function rechazarExpediente(idExpediente, justificacion, idCoordinador) {
  const pool = await getPool();
  await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .input('justificacion', sql.NVarChar(sql.MAX), justificacion)
    .input('idCoordinador', sql.Int, idCoordinador)
    .execute('sp_RechazarExpediente');
}

module.exports = {
  crearExpediente,
  actualizarExpediente,
  obtenerExpedientes,
  eliminarExpediente,
  enviarRevision,
  aprobarExpediente,
  rechazarExpediente,
};