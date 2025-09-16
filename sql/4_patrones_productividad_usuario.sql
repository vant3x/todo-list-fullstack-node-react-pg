-- 4. Patrones de Productividad del Usuario
-- Horas pico y días de la semana de creación y completado de tareas.

SELECT
    EXTRACT(HOUR FROM fecha_creacion) AS hora_creacion,
    TRIM(TO_CHAR(fecha_creacion, 'Day')) AS dia_semana_creacion,
    COUNT(id) AS total_tareas_creadas,
    EXTRACT(HOUR FROM fecha_completado) AS hora_completado,
    TRIM(TO_CHAR(fecha_completado, 'Day')) AS dia_semana_completado,
    COUNT(CASE WHEN completada = TRUE THEN id END) AS total_tareas_completadas
FROM
    tareas
GROUP BY
    hora_creacion, dia_semana_creacion, hora_completado, dia_semana_completado
ORDER BY
    total_tareas_creadas DESC, total_tareas_completadas DESC;