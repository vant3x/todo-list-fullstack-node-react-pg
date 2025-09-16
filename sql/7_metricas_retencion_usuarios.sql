-- 7. Métricas de Retención de Usuarios
-- ¿Cuántos usuarios han creado al menos una tarea en cada una de las últimas 4 semanas, y cuál es la tasa de retención semana a semana?

WITH UserActivity AS (
    SELECT
        usuario_id,
        EXTRACT(WEEK FROM fecha_creacion) AS week_num,
        EXTRACT(YEAR FROM fecha_creacion) AS year_num
    FROM
        tareas
    WHERE
        fecha_creacion >= NOW() - INTERVAL '4 weeks'
    GROUP BY
        usuario_id, EXTRACT(WEEK FROM fecha_creacion), EXTRACT(YEAR FROM fecha_creacion)
),
WeeklyActiveUsers AS (
    SELECT
        year_num,
        week_num,
        COUNT(DISTINCT usuario_id) AS active_users_count
    FROM
        UserActivity
    GROUP BY
        year_num, week_num
    ORDER BY
        year_num DESC, week_num DESC
),
Retention AS (
    SELECT
        wau1.year_num,
        wau1.week_num,
        wau1.active_users_count AS current_week_active_users,
        wau2.active_users_count AS previous_week_active_users,
        COUNT(DISTINCT ua1.usuario_id) AS retained_users
    FROM
        WeeklyActiveUsers wau1
    LEFT JOIN
        WeeklyActiveUsers wau2 ON wau1.year_num = wau2.year_num AND wau1.week_num = wau2.week_num + 1
    LEFT JOIN
        UserActivity ua1 ON wau1.usuario_id = ua1.usuario_id AND ua1.year_num = wau1.year_num AND ua1.week_num = wau1.week_num
    LEFT JOIN
        UserActivity ua2 ON wau1.usuario_id = ua2.usuario_id AND ua2.year_num = wau2.year_num AND ua2.week_num = wau2.week_num
    WHERE
        ua1.usuario_id IS NOT NULL AND ua2.usuario_id IS NOT NULL -- Users active in both weeks
    GROUP BY
        wau1.year_num, wau1.week_num, wau1.active_users_count, wau2.active_users_count
)
SELECT
    year_num,
    week_num,
    current_week_active_users,
    previous_week_active_users,
    retained_users,
    CASE
        WHEN previous_week_active_users > 0 THEN
            ROUND((retained_users::numeric / previous_week_active_users) * 100, 2)
        ELSE
            0
    END AS retention_rate_percentage
FROM
    Retention
ORDER BY
    year_num DESC, week_num DESC;
