const service = require('../services/indicios.service');

async function crear(req, res, next) {
  try {
    const { idExpediente, descripcion, color, tamano, peso, ubicacion } = req.body;
    const idTecnicoRegistro = req.user.idUsuario;

    const data = await service.crearIndicio({
      idExpediente,
      descripcion,
      color,
      tamano,
      peso,
      ubicacion,
      idTecnicoRegistro,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function listarPorExpediente(req, res, next) {
  try {
    const { idExpediente } = req.params;
    const data = await service.obtenerIndiciosPorExpediente(idExpediente);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { descripcion, color, tamano, peso, ubicacion } = req.body;

    await service.actualizarIndicio({
      idIndicio: id,
      descripcion,
      color,
      tamano,
      peso,
      ubicacion,
    });

    res.json({ message: 'Indicio actualizado' });
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    await service.eliminarIndicio(id);
    res.json({ message: 'Indicio eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crear,
  listarPorExpediente,
  actualizar,
  eliminar,
};