const { getPool, sql } = require('../db/sqlserver');

async function getUsuarioPorNombre(usuario) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('usuario', sql.NVarChar(50), usuario)
    .execute('sp_LoginUsuario');

  return result.recordset[0] || null;
}

module.exports = {
  getUsuarioPorNombre,
};