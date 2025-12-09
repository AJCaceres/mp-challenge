const service = require('../services/expedientes.service');

async function crear(req, res, next) {
  try {
    const { numeroExpediente } = req.body;
    const idTecnico = req.user.idUsuario;

    const data = await service.crearExpediente({ numeroExpediente, idTecnico });
    res.json(data);

  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { estado, fechaDesde, fechaHasta } = req.query;
    const data = await service.obtenerExpedientes({ estado, fechaDesde, fechaHasta });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const idExpediente = req.params.id;
    const { numeroExpediente } = req.body;

    await service.actualizarExpediente({ idExpediente, numeroExpediente });
    res.json({ message: 'Expediente actualizado' });

  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const idExpediente = req.params.id;
    await service.eliminarExpediente(idExpediente);
    res.json({ message: 'Expediente eliminado' });

  } catch (err) {
    next(err);
  }
}

async function enviarRevision(req, res, next) {
  try {
    const idExpediente = req.params.id;
    await service.enviarRevision(idExpediente);
    res.json({ message: 'Enviado a revisión' });

  } catch (err) {
    next(err);
  }
}

async function aprobar(req, res, next) {
  try {
    const idExpediente = req.params.id;
    const idCoordinador = req.user.idUsuario;

    await service.aprobarExpediente(idExpediente, idCoordinador);
    res.json({ message: 'Expediente aprobado' });

  } catch (err) {
    next(err);
  }
}

async function rechazar(req, res, next) {
  try {
    const idExpediente = req.params.id;
    const { justificacion } = req.body;
    const idCoordinador = req.user.idUsuario;

    await service.rechazarExpediente(idExpediente, justificacion, idCoordinador);
    res.json({ message: 'Expediente rechazado' });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  crear,
  listar,
  actualizar,
  eliminar,
  enviarRevision,
  aprobar,
  rechazar,
};