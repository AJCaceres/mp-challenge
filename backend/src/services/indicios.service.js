const repo = require('../repositories/indicios.repository');

async function crearIndicio({
  idExpediente,
  descripcion,
  color,
  tamano,
  peso,
  ubicacion,
  idTecnicoRegistro,
}) {
  if (!idExpediente) throw new Error('idExpediente es obligatorio');
  if (!descripcion) throw new Error('La descripción es obligatoria');

  return await repo.crearIndicio({
    idExpediente,
    descripcion,
    color,
    tamano,
    peso,
    ubicacion,
    idTecnicoRegistro,
  });
}

async function obtenerIndiciosPorExpediente(idExpediente) {
  if (!idExpediente) throw new Error('idExpediente es obligatorio');
  return await repo.obtenerIndiciosPorExpediente(idExpediente);
}

async function actualizarIndicio({
  idIndicio,
  descripcion,
  color,
  tamano,
  peso,
  ubicacion,
}) {
  if (!idIndicio) throw new Error('idIndicio es obligatorio');
  return await repo.actualizarIndicio({
    idIndicio,
    descripcion,
    color,
    tamano,
    peso,
    ubicacion,
  });
}

async function eliminarIndicio(idIndicio) {
  if (!idIndicio) throw new Error('idIndicio es obligatorio');
  return await repo.eliminarIndicio(idIndicio);
}

module.exports = {
  crearIndicio,
  obtenerIndiciosPorExpediente,
  actualizarIndicio,
  eliminarIndicio,
};