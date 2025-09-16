-- 2. Tendencias de Tasa de Completado
-- Tasa de completado diaria de tareas en los últimos 90 días, agrupada por nivel de prioridad.

SELECT
    DATE(creado_en) AS fecha,
    prioridad,
    COUNT(id) AS total_tareas,
    COUNT(CASE WHEN completada = TRUE THEN id END) AS tareas_completadas,
    ROUND((COUNT(CASE WHEN completada = TRUE THEN id END)::numeric / COUNT(id)) * 100, 2) AS tasa_completado_porcentaje
FROM
    "tareas"
WHERE
    creado_en >= NOW() - INTERVAL '90 days'
GROUP BY
    DATE(creado_en), prioridad
ORDER BY
    fecha ASC, prioridad;
