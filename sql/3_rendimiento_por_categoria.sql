-- 3. Rendimiento por Categoría
-- Tasas de completado más altas y más bajas, y tiempo promedio de completado para cada categoría.

SELECT
    c.nombre AS categoria_nombre,
    COUNT(t.id) AS total_tareas_categoria,
    COUNT(CASE WHEN t.completada = TRUE THEN t.id END) AS tareas_completadas_categoria,
    ROUND((COUNT(CASE WHEN t.completada = TRUE THEN t.id END)::numeric / COUNT(t.id)) * 100, 2) AS tasa_completado_porcentaje,
    AVG(EXTRACT(EPOCH FROM (t.fecha_completado - t.creado_en))) / 3600 / 24 AS tiempo_promedio_completado_dias
FROM
    "categorias" c
JOIN
    "tareas" t ON c.id = t.categoria_id
WHERE
    t.completada = TRUE 
GROUP BY
    c.nombre
ORDER BY
    tasa_completado_porcentaje DESC;
