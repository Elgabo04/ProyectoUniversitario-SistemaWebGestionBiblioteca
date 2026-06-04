-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2026 a las 04:25:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `titulo`, `autor`, `categoria`, `cantidad`) VALUES
(6, 'Cien años de soledad', 'Gabriel García Márquez', 'Novela', 3),
(7, 'El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Novela', 2),
(8, 'La sombra del viento', 'Carlos Ruiz Zafón', 'Misterio', 4),
(9, 'El código Da Vinci', 'Dan Brown', 'Suspenso', 5),
(10, '1984', 'George Orwell', 'Ciencia Ficción', 6),
(11, 'Un mundo feliz', 'Aldous Huxley', 'Ciencia Ficción', 3),
(12, 'Fahrenheit 451', 'Ray Bradbury', 'Ciencia Ficción', 2),
(13, 'Orgullo y prejuicio', 'Jane Austen', 'Romance', 4),
(14, 'Cumbres borrascosas', 'Emily Brontë', 'Clásico', 2),
(15, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 'Clásico', 1),
(16, 'La vuelta al mundo en 80 días', 'Julio Verne', 'Aventura', 3),
(17, 'Veinte mil leguas de viaje submarino', 'Julio Verne', 'Aventura', 2),
(18, 'El principito', 'Antoine de Saint-Exupéry', 'Infantil', 5),
(19, 'Harry Potter y la piedra filosofal', 'J.K. Rowling', 'Fantasía', 4),
(20, 'Harry Potter y la cámara secreta', 'J.K. Rowling', 'Fantasía', 3),
(21, 'El hobbit', 'J.R.R. Tolkien', 'Fantasía', 3),
(22, 'Clean Code', 'Robert C. Martin', 'Programación', 2),
(23, 'JavaScript: The Good Parts', 'Douglas Crockford', 'Programación', 4),
(24, 'Introducción a algoritmos', 'Thomas H. Cormen', 'Educación', 1),
(25, 'La biblioteca de la medianoche', 'Matt Haig', 'Ficción contemporánea', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `libro_id` int(11) DEFAULT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `fecha_prestamo` date DEFAULT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `estado` enum('pendiente','prestado','devuelto') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','usuario') DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `libro_id` (`libro_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
