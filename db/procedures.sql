CREATE OR ALTER PROCEDURE sp_LoginUsuario
    @usuario NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        idUsuario,
        nombre,
        usuario,
        passwordHash,
        rol,
        estado
    FROM Usuarios
    WHERE usuario = @usuario
      AND estado = 1;
END
GO

CREATE OR ALTER PROCEDURE sp_ObtenerExpedientes
    @estado NVARCHAR(20) = NULL,
    @fechaDesde DATETIME = NULL,
    @fechaHasta DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.idExpediente,
        e.numeroExpediente,
        e.fechaRegistro,
        e.idTecnicoRegistro,
        u.nombre AS tecnicoNombre,
        es.nombre AS estado,
        e.justificacionRechazo,
        e.fechaAprobacion,
        e.idCoordinadorAprobacion
    FROM Expedientes e
    INNER JOIN Usuarios u ON e.idTecnicoRegistro = u.idUsuario
    INNER JOIN EstadosExpediente es ON e.idEstado = es.idEstado
    WHERE
        (@estado IS NULL OR es.nombre = @estado)
        AND (@fechaDesde IS NULL OR e.fechaRegistro >= @fechaDesde)
        AND (@fechaHasta IS NULL OR e.fechaRegistro <= @fechaHasta)
    ORDER BY e.fechaRegistro DESC;
END
GO


CREATE OR ALTER PROCEDURE sp_CrearExpediente
    @numeroExpediente NVARCHAR(50),
    @idTecnicoRegistro INT
AS
BEGIN
    INSERT INTO Expedientes (numeroExpediente, idTecnicoRegistro)
    VALUES (@numeroExpediente, @idTecnicoRegistro);

    SELECT SCOPE_IDENTITY() AS idExpediente;
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarExpediente
    @idExpediente INT,
    @numeroExpediente NVARCHAR(50)
AS
BEGIN
    UPDATE Expedientes
    SET numeroExpediente = @numeroExpediente
    WHERE idExpediente = @idExpediente
      AND idEstado IN (1, 4); -- BORRADOR o RECHAZADO
END
GO

CREATE OR ALTER PROCEDURE sp_EnviarRevision
    @idExpediente INT
AS
BEGIN
    UPDATE Expedientes
    SET idEstado = 2 -- EN_REVISION
    WHERE idExpediente = @idExpediente
      AND idEstado IN (1, 4);
END
GO

CREATE OR ALTER PROCEDURE sp_AprobarExpediente
    @idExpediente INT,
    @idCoordinador INT
AS
BEGIN
    UPDATE Expedientes
    SET idEstado = 3, -- APROBADO
        fechaAprobacion = GETDATE(),
        idCoordinadorAprobacion = @idCoordinador
    WHERE idExpediente = @idExpediente
      AND idEstado = 2; -- EN_REVISION
END
GO

CREATE OR ALTER PROCEDURE sp_RechazarExpediente
    @idExpediente INT,
    @justificacion NVARCHAR(MAX),
    @idCoordinador INT
AS
BEGIN
    UPDATE Expedientes
    SET idEstado = 4, -- RECHAZADO
        justificacionRechazo = @justificacion,
        idCoordinadorAprobacion = @idCoordinador
    WHERE idExpediente = @idExpediente
      AND idEstado = 2; -- EN_REVISION
END
GO

-- INDICIOS
CREATE OR ALTER PROCEDURE sp_CrearIndicio
(
    @idExpediente INT,
    @descripcion NVARCHAR(300),
    @color NVARCHAR(100),
    @tamano NVARCHAR(100),
    @peso NVARCHAR(50),
    @ubicacion NVARCHAR(200),
    @idTecnicoRegistro INT
)
AS
BEGIN
    INSERT INTO Indicios (
        idExpediente, descripcion, color, tamano, peso, ubicacion, idTecnicoRegistro
    )
    VALUES (
        @idExpediente, @descripcion, @color, @tamano, @peso, @ubicacion, @idTecnicoRegistro
    );

    SELECT SCOPE_IDENTITY() AS idIndicio;
END
GO

CREATE OR ALTER PROCEDURE sp_ObtenerIndiciosPorExpediente
    @idExpediente INT
AS
BEGIN
    SELECT *
    FROM Indicios
    WHERE idExpediente = @idExpediente;
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarIndicio
    @idIndicio INT,
    @descripcion NVARCHAR(300),
    @color NVARCHAR(100),
    @tamano NVARCHAR(100),
    @peso NVARCHAR(50),
    @ubicacion NVARCHAR(200)
AS
BEGIN
    UPDATE Indicios
    SET descripcion = @descripcion,
        color = @color,
        tamano = @tamano,
        peso = @peso,
        ubicacion = @ubicacion
    WHERE idIndicio = @idIndicio;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarIndicio
    @idIndicio INT
AS
BEGIN
    DELETE FROM Indicios
    WHERE idIndicio = @idIndicio;
END
GO

-------------------------------------------------
-- REPORTE: CONTEO DE EXPEDIENTES POR ESTADO
-- FILTRO OPCIONAL POR RANGO DE FECHAS (fechaRegistro)
-------------------------------------------------
CREATE OR ALTER PROCEDURE sp_ReporteExpedientesPorEstado
    @fechaDesde DATETIME = NULL,
    @fechaHasta DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        es.nombre AS estado,
        COUNT(*) AS total
    FROM Expedientes e
    INNER JOIN EstadosExpediente es ON e.idEstado = es.idEstado
    WHERE
        (@fechaDesde IS NULL OR e.fechaRegistro >= @fechaDesde)
        AND (@fechaHasta IS NULL OR e.fechaRegistro <= @fechaHasta)
    GROUP BY es.nombre
    ORDER BY es.nombre;
END
GO