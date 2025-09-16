-- 5. Análisis de Tareas Vencidas
-- Pregunta: ¿Cuántas tareas están actualmente vencidas, agrupadas por usuario y categoría, y cuál es el promedio de días que están vencidas?

SELECT
    u.nombre AS nombre_usuario,
    c.nombre AS nombre_categoria,
    COUNT(t.id) AS numero_de_tareas_vencidas,
    ROUND(AVG(EXTRACT(DAY FROM (NOW() - t.fecha_vencimiento))), 2) AS promedio_dias_vencidas
FROM
    tareas t
JOIN
    usuarios u ON t.usuario_id = u.id
JOIN
    categorias c ON t.categoria_id = c.id
WHERE
    t.completada = FALSE
    AND t.fecha_vencimiento < NOW()
GROUP BY
    u.nombre,
    c.nombre
ORDER BY
    promedio_dias_vencidas DESC,
    numero_de_tareas_vencidas DESC;
