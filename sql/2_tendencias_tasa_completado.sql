-- 2. Tendencias de Tasa de Completado
-- Tasa de completado diaria de tareas en los últimos 90 días, agrupada por nivel de prioridad.

SELECT
    DATE(fecha_creacion) AS fecha,
    prioridad,
    COUNT(id) AS total_tareas,
    COUNT(CASE WHEN completada = TRUE THEN id END) AS tareas_completadas,
    ROUND((COUNT(CASE WHEN completada = TRUE THEN id END)::numeric / COUNT(id)) * 100, 2) AS tasa_completado_porcentaje
FROM
    tareas
WHERE
    fecha_creacion >= NOW() - INTERVAL '90 days'
GROUP BY
    DATE(fecha_creacion), prioridad
ORDER BY
    fecha ASC, prioridad;