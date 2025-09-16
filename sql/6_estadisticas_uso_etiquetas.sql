-- 6. Estadísticas de Uso de Etiquetas
-- Pregunta: ¿Cuáles son las etiquetas más frecuentemente utilizadas, y qué etiquetas están asociadas con las tasas de completado más altas?

WITH EtiquetaUso AS (
    SELECT
        e.nombre AS nombre_etiqueta,
        COUNT(te.etiqueta_id) AS total_usos
    FROM
        etiquetas e
    JOIN
        tarea_etiquetas te ON e.id = te.etiqueta_id
    GROUP BY
        e.nombre
),
EtiquetaTasaCompletado AS (
    SELECT
        e.nombre AS nombre_etiqueta,
        COUNT(CASE WHEN t.completada = TRUE THEN 1 END) AS tareas_completadas,
        COUNT(t.id) AS total_tareas,
        (CAST(COUNT(CASE WHEN t.completada = TRUE THEN 1 END) AS DECIMAL) * 100 / COUNT(t.id)) AS tasa_completado
    FROM
        etiquetas e
    JOIN
        tarea_etiquetas te ON e.id = te.etiqueta_id
    JOIN
        tareas t ON te.tarea_id = t.id
    GROUP BY
        e.nombre
)
SELECT
    eu.nombre_etiqueta,
    eu.total_usos,
    etc.tasa_completado
FROM
    EtiquetaUso eu
LEFT JOIN
    EtiquetaTasaCompletado etc ON eu.nombre_etiqueta = etc.nombre_etiqueta
ORDER BY
    eu.total_usos DESC,
    etc.tasa_completado DESC;
