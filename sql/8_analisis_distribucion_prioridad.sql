-- 8. Análisis de Distribución de Prioridad
-- ¿Cuál es la distribución de tareas a través de los niveles de prioridad para usuarios activos (usuarios que han iniciado sesión en los últimos 7 días)?

SELECT
    t.prioridad,
    COUNT(t.id) AS total_tareas,
    ROUND((COUNT(t.id)::numeric / (SELECT COUNT(*) FROM tareas WHERE usuario_id IN (SELECT id FROM usuarios WHERE last_login >= NOW() - INTERVAL '7 days')) ) * 100, 2) AS porcentaje_distribucion
FROM
    tareas t
JOIN
    usuarios u ON t.usuario_id = u.id
WHERE
    u.last_login >= NOW() - INTERVAL '7 days'
GROUP BY
    t.prioridad
ORDER BY
    total_tareas DESC;
