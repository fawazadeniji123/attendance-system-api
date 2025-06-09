import {
  getAttendanceByCourse,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from '../models/attendanceModel.js';

export async function getAttendance(req, res) {
  const { courseId } = req.params;
  const { day, month, year } = req.query;
  if (!courseId || !day || !month || !year) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return res.status(400).json({ message: 'Invalid date parameters' });
  }
  const parsedDay = parseInt(day, 10);
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);
  try {
    const attendance = await getAttendanceByCourse(courseId, { day: parsedDay, month: parsedMonth, year: parsedYear });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance records not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
}

export async function createAttendance(req, res) {
  const { courseId, studentId, date, status } = req.body;
  try {
    const newAttendance = await createAttendanceRecord({
      courseId,
      studentId,
      date,
      status,
    });
    if (!newAttendance) {
      return res.status(400).json({ message: 'Attendance record already exists for this date' });
    }
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ message: 'Failed to create attendance record' });
  }
}

export async function updateAttendance(req, res) {
  const { attendanceId } = req.params;
  const { date, status } = req.body;
  try {
    const updatedAttendance = await updateAttendanceRecord(attendanceId, {
      date,
      status,
    });
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Failed to update attendance record' });
  }
}

export async function deleteAttendance(req, res) {
  const { attendanceId } = req.params;
  try {
    const deletedAttendance = await deleteAttendanceRecord(attendanceId);
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Failed to delete attendance record' });
  }
}
