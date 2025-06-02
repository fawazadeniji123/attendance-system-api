import {
  getAttendanceByCourse,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from '../models/attendanceModel.js';

export async function getAttendance(req, res) {
  const { courseId } = req.params;
  try {
    const attendance = await getAttendanceByCourse(courseId);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance records not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
}

export async function createAttendance(req, res) {
  const { courseId, date, status } = req.body;
  try {
    const newAttendance = await createAttendanceRecord({
      courseId,
      date,
      status,
    });
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: 'Failed to create attendance record' });
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
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
}

export async function deleteAttendance(req, res) {
  const { attendanceId } = req.params;
  try {
    const deletedAttendance = await deleteAttendanceRecord(attendanceId);
    if (!deletedAttendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
}
