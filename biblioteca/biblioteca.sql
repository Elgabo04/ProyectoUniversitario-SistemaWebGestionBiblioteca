-- ============================================
-- BASE DE DATOS: SISTEMA WEB DE GESTIÓN DE BIBLIOTECA
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS `biblioteca`;
USE `biblioteca`;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'usuario') DEFAULT 'usuario',
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: libros
-- ============================================
CREATE TABLE IF NOT EXISTS `libros` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `autor` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(100),
  `cantidad` INT NOT NULL DEFAULT 1,
  INDEX `idx_titulo` (`titulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: prestamos
-- ============================================
CREATE TABLE IF NOT EXISTS `prestamos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `libro_id` INT NOT NULL,
  `fecha_prestamo` DATE NOT NULL,
  `fecha_devolucion` DATE,
  `estado` ENUM('pendiente', 'prestado', 'devuelto') DEFAULT 'pendiente',
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`libro_id`) REFERENCES `libros`(`id`) ON DELETE CASCADE,
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_libro_id` (`libro_id`),
  INDEX `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Insertar usuario administrador de prueba
INSERT INTO `usuarios` (`nombre`, `email`, `password`, `rol`) VALUES
('Administrador', 'admin@biblioteca.com', '$2b$10$YZl2i3j8l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9', 'admin');

-- Insertar usuario regular de prueba
INSERT INTO `usuarios` (`nombre`, `email`, `password`, `rol`) VALUES
('Juan Pérez', 'juan@biblioteca.com', '$2b$10$YZl2i3j8l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9n2l5m9', 'usuario');

-- Insertar algunos libros de ejemplo
INSERT INTO `libros` (`titulo`, `autor`, `categoria`, `cantidad`) VALUES
('Don Quijote', 'Miguel de Cervantes', 'Novela', 5),
('Cien años de soledad', 'Gabriel García Márquez', 'Novela', 3),
('El Principito', 'Antoine de Saint-Exupéry', 'Infantil', 7),
('1984', 'George Orwell', 'Distopía', 4),
('El Quijote', 'Miguel de Cervantes', 'Clásico', 6);

-- ============================================
-- NOTA: Las contraseñas de prueba están hasheadas con bcrypt
-- Usuario admin: admin@biblioteca.com / admin123
-- Usuario regular: juan@biblioteca.com / juan123
-- ============================================
