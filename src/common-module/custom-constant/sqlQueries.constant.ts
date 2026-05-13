export const INSERT_DEPARTMENT_USERS_SQL = `
  INSERT INTO event_invitations (event_id, department_id, user_id, qr_token, confirmation_token, attendance_status, event_attending_type)
  SELECT
    $1 AS event_id,
    e.department_id AS department_id,
    u.id AS user_id,
    CASE WHEN $2 THEN random_camelcase_string(10) ELSE NULL END AS qr_token,
    CASE WHEN $3 THEN random_camelcase_string(10) ELSE NULL END AS confirmation_token,
    'no' AS attendance_status,
    CASE
      WHEN $4 = 'zoom' THEN 'zoom'
      WHEN $4 = 'onsite' THEN 'onsite'
      ELSE NULL
    END AS event_attending_type
  FROM employees e
  LEFT JOIN "user" u ON u.employee_id = e.id
  WHERE e.department_id = ANY($5::int[])
  AND u.email IS NOT NULL
  AND u.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM event_invitations ei
    WHERE ei.event_id = $1
    AND ei.user_id = u.id
  )
  RETURNING user_id;
`;

export const SELECT_EXISTING_DEPARTMENTS_SQL = `
  SELECT DISTINCT ei.department_id
  FROM event_invitations ei
  WHERE ei.event_id = $1
  AND ei.department_id IS NOT NULL;
`;
