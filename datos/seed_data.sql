-- Script para insertar datos de ejemplo en la base de datos
-- Asegúrate de que las tablas estén vacías antes de ejecutar este script si no quieres duplicados.

-- Desactivar verificaciones de claves foráneas temporalmente si es necesario (depende de la DB)
-- SET session_replication_role = 'replica';

-- Limpiar tablas existentes (opcional, descomentar si se desea reiniciar los datos)
-- DELETE FROM tarea_etiquetas;
-- DELETE FROM tareas;
-- DELETE FROM categorias;
-- DELETE FROM etiquetas;
-- DELETE FROM usuarios;

-- Insertar Usuarios
INSERT INTO usuarios (id, email, password, nombre, apellido, creado_en, last_login) VALUES
('user1_uuid', 'usuario1@example.com', '$2a$10$abcdefghijklmnopqrstuvw.xyz', 'Juan', 'Perez', NOW() - INTERVAL '180 days', NOW() - INTERVAL '5 days'),
('user2_uuid', 'usuario2@example.com', '$2a$10$abcdefghijklmnopqrstuvw.xyz', 'Maria', 'Gomez', NOW() - INTERVAL '150 days', NOW() - INTERVAL '1 day'),
('user3_uuid', 'usuario3@example.com', '$2a$10$abcdefghijklmnopqrstuvw.xyz', 'Carlos', 'Ruiz', NOW() - INTERVAL '120 days', NOW() - INTERVAL '10 days');

-- Insertar Categorías para Usuario 1
INSERT INTO categorias (id, nombre, usuario_id) VALUES
('cat1_user1_uuid', 'Trabajo', 'user1_uuid'),
('cat2_user1_uuid', 'Personal', 'user1_uuid'),
('cat3_user1_uuid', 'Estudios', 'user1_uuid');

-- Insertar Categorías para Usuario 2
INSERT INTO categorias (id, nombre, usuario_id) VALUES
('cat1_user2_uuid', 'Proyectos', 'user2_uuid'),
('cat2_user2_uuid', 'Hogar', 'user2_uuid');

-- Insertar Categorías para Usuario 3
INSERT INTO categorias (id, nombre, usuario_id) VALUES
('cat1_user3_uuid', 'Compras', 'user3_uuid');

-- Insertar Etiquetas para Usuario 1
INSERT INTO etiquetas (id, nombre, usuario_id) VALUES
('tag1_user1_uuid', 'Urgente', 'user1_uuid'),
('tag2_user1_uuid', 'Importante', 'user1_uuid'),
('tag3_user1_uuid', 'Diario', 'user1_uuid');

-- Insertar Etiquetas para Usuario 2
INSERT INTO etiquetas (id, nombre, usuario_id) VALUES
('tag1_user2_uuid', 'Finanzas', 'user2_uuid'),
('tag2_user2_uuid', 'Salud', 'user2_uuid');

-- Insertar Etiquetas para Usuario 3
INSERT INTO etiquetas (id, nombre, usuario_id) VALUES
('tag1_user3_uuid', 'Entretenimiento', 'user3_uuid');

-- Insertar Tareas para Usuario 1 (variedad de fechas, estados y prioridades)
INSERT INTO tareas (id, titulo, descripcion, completada, fecha_creacion, fecha_vencimiento, prioridad, usuario_id, categoria_id, fecha_completado) VALUES
-- Tareas recientes (últimos 30 días)
('task1_user1_uuid', 'Reunión de equipo', 'Preparar presentación para la reunión semanal', FALSE, NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', 'ALTA', 'user1_uuid', 'cat1_user1_uuid', NULL),
('task2_user1_uuid', 'Enviar informe', 'Informe mensual de ventas', TRUE, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', 'ALTA', 'user1_uuid', 'cat1_user1_uuid', NOW() - INTERVAL '4 days'),
('task3_user1_uuid', 'Comprar víveres', 'Lista de compras para la semana', FALSE, NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 'MEDIA', 'user1_uuid', 'cat2_user1_uuid', NULL),
('task4_user1_uuid', 'Estudiar capítulo 5', 'Repasar para el examen', TRUE, NOW() - INTERVAL '15 days', NOW() - INTERVAL '7 days', 'MEDIA', 'user1_uuid', 'cat3_user1_uuid', NOW() - INTERVAL '8 days'),
('task5_user1_uuid', 'Planificar vacaciones', 'Buscar destinos y vuelos', FALSE, NOW() - INTERVAL '20 days', NOW() + INTERVAL '30 days', 'BAJA', 'user1_uuid', 'cat2_user1_uuid', NULL),
('task6_user1_uuid', 'Responder correos', 'Correos pendientes de clientes', FALSE, NOW() - INTERVAL '1 day', NOW() + INTERVAL '0 days', 'ALTA', 'user1_uuid', 'cat1_user1_uuid', NULL),
('task7_user1_uuid', 'Ejercicio diario', 'Rutina de cardio', TRUE, NOW() - INTERVAL '25 days', NOW() - INTERVAL '10 days', 'BAJA', 'user1_uuid', 'cat2_user1_uuid', NOW() - INTERVAL '11 days'),
('task8_user1_uuid', 'Actualizar CV', 'Añadir últimos proyectos', FALSE, NOW() - INTERVAL '7 days', NOW() + INTERVAL '7 days', 'MEDIA', 'user1_uuid', 'cat3_user1_uuid', NULL),
('task9_user1_uuid', 'Pagar facturas', 'Facturas de servicios', TRUE, NOW() - INTERVAL '12 days', NOW() - INTERVAL '5 days', 'ALTA', 'user1_uuid', 'cat2_user1_uuid', NOW() - INTERVAL '6 days'),
('task10_user1_uuid', 'Investigar nuevo software', 'Herramienta de gestión de proyectos', FALSE, NOW() - INTERVAL '3 days', NOW() + INTERVAL '5 days', 'MEDIA', 'user1_uuid', 'cat1_user1_uuid', NULL),
-- Tareas anteriores (30-60 días)
('task11_user1_uuid', 'Proyecto X fase 1', 'Completar la primera fase del proyecto', TRUE, NOW() - INTERVAL '40 days', NOW() - INTERVAL '35 days', 'ALTA', 'user1_uuid', 'cat1_user1_uuid', NOW() - INTERVAL '36 days'),
('task12_user1_uuid', 'Limpiar el coche', 'Lavado y aspirado', FALSE, NOW() - INTERVAL '50 days', NOW() - INTERVAL '45 days', 'BAJA', 'user1_uuid', 'cat2_user1_uuid', NULL),
('task13_user1_uuid', 'Leer libro', 'Capítulos 1-3', TRUE, NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days', 'MEDIA', 'user1_uuid', 'cat3_user1_uuid', NOW() - INTERVAL '33 days'),
-- Tareas vencidas
('task14_user1_uuid', 'Renovar suscripción', 'Suscripción de software', FALSE, NOW() - INTERVAL '60 days', NOW() - INTERVAL '40 days', 'ALTA', 'user1_uuid', 'cat2_user1_uuid', NULL),
('task15_user1_uuid', 'Entregar propuesta', 'Propuesta para cliente A', FALSE, NOW() - INTERVAL '45 days', NOW() - INTERVAL '20 days', 'ALTA', 'user1_uuid', 'cat1_user1_uuid', NULL);

-- Insertar Tareas para Usuario 2
INSERT INTO tareas (id, titulo, descripcion, completada, fecha_creacion, fecha_vencimiento, prioridad, usuario_id, categoria_id, fecha_completado) VALUES
('task1_user2_uuid', 'Revisar presupuesto', 'Presupuesto trimestral', FALSE, NOW() - INTERVAL '7 days', NOW() + INTERVAL '3 days', 'ALTA', 'user2_uuid', 'cat1_user2_uuid', NULL),
('task2_user2_uuid', 'Organizar armario', 'Limpieza de primavera', TRUE, NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 'BAJA', 'user2_uuid', 'cat2_user2_uuid', NOW() - INTERVAL '11 days'),
('task3_user2_uuid', 'Preparar cena', 'Receta nueva', FALSE, NOW() - INTERVAL '1 day', NOW() + INTERVAL '0 days', 'MEDIA', 'user2_uuid', 'cat2_user2_uuid', NULL),
('task4_user2_uuid', 'Reporte de gastos', 'Enviar a contabilidad', FALSE, NOW() - INTERVAL '35 days', NOW() - INTERVAL '20 days', 'ALTA', 'user2_uuid', 'cat1_user2_uuid', NULL);

-- Insertar Tareas para Usuario 3
INSERT INTO tareas (id, titulo, descripcion, completada, fecha_creacion, fecha_vencimiento, prioridad, usuario_id, categoria_id, fecha_completado) VALUES
('task1_user3_uuid', 'Ver película', 'Película recomendada', TRUE, NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', 'BAJA', 'user3_uuid', 'cat1_user3_uuid', NOW() - INTERVAL '6 days'),
('task2_user3_uuid', 'Comprar regalo', 'Regalo de cumpleaños', FALSE, NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'MEDIA', 'user3_uuid', 'cat1_user3_uuid', NULL);

-- Insertar relaciones Tarea-Etiqueta
INSERT INTO tarea_etiquetas (tarea_id, etiqueta_id) VALUES
('task1_user1_uuid', 'tag1_user1_uuid'), -- Reunión de equipo (Urgente)
('task2_user1_uuid', 'tag2_user1_uuid'), -- Enviar informe (Importante)
('task3_user1_uuid', 'tag3_user1_uuid'), -- Comprar víveres (Diario)
('task4_user1_uuid', 'tag2_user1_uuid'), -- Estudiar capítulo 5 (Importante)
('task6_user1_uuid', 'tag1_user1_uuid'), -- Responder correos (Urgente)
('task9_user1_uuid', 'tag2_user1_uuid'), -- Pagar facturas (Importante)
('task14_user1_uuid', 'tag1_user1_uuid'), -- Renovar suscripción (Urgente)
('task1_user2_uuid', 'tag1_user2_uuid'), -- Revisar presupuesto (Finanzas)
('task2_user2_uuid', 'tag2_user2_uuid'), -- Organizar armario (Salud)
('task4_user2_uuid', 'tag1_user2_uuid'), -- Reporte de gastos (Finanzas)
('task1_user3_uuid', 'tag1_user3_uuid'); -- Ver película (Entretenimiento)

-- Reactivar verificaciones de claves foráneas
-- SET session_replication_role = 'origin';
