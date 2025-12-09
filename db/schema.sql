CREATE TABLE Usuarios (
    idUsuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(150) NOT NULL,
    usuario NVARCHAR(50) NOT NULL UNIQUE,
    passwordHash NVARCHAR(200) NOT NULL,
    rol NVARCHAR(30) NOT NULL CHECK (rol IN ('TECNICO', 'COORDINADOR')),
    estado BIT NOT NULL DEFAULT 1
);

CREATE TABLE EstadosExpediente (
    idEstado INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO EstadosExpediente (nombre)
VALUES ('BORRADOR'), ('EN_REVISION'), ('APROBADO'), ('RECHAZADO');

CREATE TABLE Expedientes (
    idExpediente INT IDENTITY(1,1) PRIMARY KEY,
    numeroExpediente NVARCHAR(50) NOT NULL,
    fechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    idTecnicoRegistro INT NOT NULL,
    idEstado INT NOT NULL DEFAULT 1, -- BORRADOR
    justificacionRechazo NVARCHAR(MAX) NULL,
    fechaAprobacion DATETIME NULL,
    idCoordinadorAprobacion INT NULL,

    CONSTRAINT FK_Exp_Tecnico FOREIGN KEY (idTecnicoRegistro) REFERENCES Usuarios(idUsuario),
    CONSTRAINT FK_Exp_Estado FOREIGN KEY (idEstado) REFERENCES EstadosExpediente(idEstado),
    CONSTRAINT FK_Exp_Coordinador FOREIGN KEY (idCoordinadorAprobacion) REFERENCES Usuarios(idUsuario)
);

CREATE TABLE Indicios (
    idIndicio INT IDENTITY(1,1) PRIMARY KEY,
    idExpediente INT NOT NULL,
    descripcion NVARCHAR(300) NOT NULL,
    color NVARCHAR(100) NULL,
    tamano NVARCHAR(100) NULL,
    peso NVARCHAR(50) NULL,
    ubicacion NVARCHAR(200) NULL,
    idTecnicoRegistro INT NOT NULL,
    fechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Ind_Exp FOREIGN KEY (idExpediente) REFERENCES Expedientes(idExpediente),
    CONSTRAINT FK_Ind_Tecnico FOREIGN KEY (idTecnicoRegistro) REFERENCES Usuarios(idUsuario)
);