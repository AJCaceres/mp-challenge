-- Passwords hashed with bcrypt:
-- user-tec: 1234
-- user-coord: 4321
INSERT INTO Usuarios (nombre, usuario, passwordHash, rol)
VALUES ('Técnico Demo', 'user-tec', '$2b$10$IJCtWyWG2LWOXa9y4VDYSOJ1qoJUYZnERiK2GIkWiJLApXO2Rteoq', 'TECNICO');

INSERT INTO Usuarios (nombre, usuario, passwordHash, rol)
VALUES ('Coordinador Demo', 'user-coord', '$2b$10$MpxTxz9K46Hi/xk3ofz3ROCMSj6sHTFLbHlDJIwH81TCYB3HE6.g.', 'COORDINADOR');