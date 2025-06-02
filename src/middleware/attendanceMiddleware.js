
export function validateAttendance(req, res, next) {
  const { courseId, attendanceId } = req.params;
  const { date, status } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  if (attendanceId && !date && !status) {
    return res.status(400).json({ error: 'At least one field (date or status) is required for update' });
  }

  if (date && typeof date !== 'string') {
    return res.status(400).json({ error: 'Date must be a string' });
  }

  if (status && !['present', 'absent', 'late'].includes(status)) {
    return res.status(400).json({ error: 'Status must be one of present, absent, or late' });
  }

  return next();
}