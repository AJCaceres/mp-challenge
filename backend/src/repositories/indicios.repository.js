const { getPool, sql } = require('../db/sqlserver');

async function crearIndicio({
  idExpediente,
  descripcion,
  color,
  tamano,
  peso,
  ubicacion,
  idTecnicoRegistro,
}) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .input('descripcion', sql.NVarChar(300), descripcion)
    .input('color', sql.NVarChar(100), color)
    .input('tamano', sql.NVarChar(100), tamano)
    .input('peso', sql.NVarChar(50), peso)
    .input('ubicacion', sql.NVarChar(200), ubicacion)
    .input('idTecnicoRegistro', sql.Int, idTecnicoRegistro)
    .execute('sp_CrearIndicio');

  return result.recordset[0];
}

async function obtenerIndiciosPorExpediente(idExpediente) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idExpediente', sql.Int, idExpediente)
    .execute('sp_ObtenerIndiciosPorExpediente');

  return result.recordset;
}

async function actualizarIndicio({
  idIndicio,
  descripcion,
  color,
  tamano,
  peso,
  ubicacion,
}) {
  const pool = await getPool();

  await pool
    .request()
    .input('idIndicio', sql.Int, idIndicio)
    .input('descripcion', sql.NVarChar(300), descripcion)
    .input('color', sql.NVarChar(100), color)
    .input('tamano', sql.NVarChar(100), tamano)
    .input('peso', sql.NVarChar(50), peso)
    .input('ubicacion', sql.NVarChar(200), ubicacion)
    .execute('sp_ActualizarIndicio');
}

async function eliminarIndicio(idIndicio) {
  const pool = await getPool();

  await pool
    .request()
    .input('idIndicio', sql.Int, idIndicio)
    .execute('sp_EliminarIndicio');
}

module.exports = {
  crearIndicio,
  obtenerIndiciosPorExpediente,
  actualizarIndicio,
  eliminarIndicio,
};