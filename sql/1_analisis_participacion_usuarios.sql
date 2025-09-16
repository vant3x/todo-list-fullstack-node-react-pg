-- Participación de Usuarios - Promedio de tareas creadas por usuario
-- Comparación entre últimos 30 días vs 30 días anteriores

WITH TareasRecientes AS (
    SELECT 
        u.id AS usuario_id,
        u.nombre AS usuario_nombre,
        COUNT(t.id) AS tareas_creadas_recientes
    FROM 
        usuarios u
    LEFT JOIN 
        tareas t ON u.id = t.usuario_id 
        AND t.fecha_creacion >= NOW() - INTERVAL '30 days'
    GROUP BY 
        u.id, u.nombre
),
TareasAnteriores AS (
    SELECT 
        u.id AS usuario_id,
        COUNT(t.id) AS tareas_creadas_anteriores
    FROM 
        usuarios u
    LEFT JOIN 
        tareas t ON u.id = t.usuario_id 
        AND t.fecha_creacion >= NOW() - INTERVAL '60 days'
        AND t.fecha_creacion < NOW() - INTERVAL '30 days'
    GROUP BY 
        u.id
),
DatosDetallados AS (
    SELECT 
        COALESCE(TR.usuario_id, TA.usuario_id) AS usuario_id,
        COALESCE(TR.usuario_nombre, 'Usuario Desconocido') AS usuario_nombre,
        COALESCE(TR.tareas_creadas_recientes, 0) AS tareas_creadas_ultimos_30_dias,
        COALESCE(TA.tareas_creadas_anteriores, 0) AS tareas_creadas_30_dias_previos,
        (COALESCE(TR.tareas_creadas_recientes, 0) - COALESCE(TA.tareas_creadas_anteriores, 0)) AS diferencia,
        CASE 
            WHEN COALESCE(TA.tareas_creadas_anteriores, 0) > 0 THEN 
                ROUND(((COALESCE(TR.tareas_creadas_recientes, 0) - COALESCE(TA.tareas_creadas_anteriores, 0))::numeric / TA.tareas_creadas_anteriores) * 100, 2)
            ELSE 
                NULL 
        END AS porcentaje_cambio
    FROM 
        TareasRecientes TR
    FULL OUTER JOIN 
        TareasAnteriores TA ON TR.usuario_id = TA.usuario_id
)

SELECT 
    'PROMEDIO GENERAL' AS tipo_resultado,
    NULL AS usuario_id,
    'TODOS LOS USUARIOS' AS usuario_nombre,
    ROUND(AVG(tareas_creadas_ultimos_30_dias)::numeric, 2) AS tareas_creadas_ultimos_30_dias,
    ROUND(AVG(tareas_creadas_30_dias_previos)::numeric, 2) AS tareas_creadas_30_dias_previos,
    ROUND(AVG(diferencia)::numeric, 2) AS diferencia,
    CASE 
        WHEN AVG(tareas_creadas_30_dias_previos) > 0 THEN
            ROUND(((AVG(tareas_creadas_ultimos_30_dias) - AVG(tareas_creadas_30_dias_previos)) / AVG(tareas_creadas_30_dias_previos)) * 100, 2)
        ELSE 
            NULL 
    END AS porcentaje_cambio
FROM DatosDetallados

UNION ALL


SELECT 
    'DETALLE USUARIO' AS tipo_resultado,
    usuario_id,
    usuario_nombre,
    tareas_creadas_ultimos_30_dias::numeric,
    tareas_creadas_30_dias_previos::numeric,
    diferencia::numeric,
    porcentaje_cambio
FROM DatosDetallados

ORDER BY 
    tipo_resultado DESC, usuario_nombre;