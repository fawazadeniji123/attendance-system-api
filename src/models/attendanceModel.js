import { prisma } from '../config/prismaClient.js';

export async function getAttendanceByCourse(courseId) {
  return await prisma.attendance.findMany({
    where: { courseId },
  });
}

export async function createAttendanceRecord(attendanceData) {
  return await prisma.attendance.create({
    data: attendanceData,
  });
}

export async function updateAttendanceRecord(attendanceId, attendanceData) {
  return await prisma.attendance.update({
    where: { id: attendanceId },
    data: attendanceData,
  });
}

export async function deleteAttendanceRecord(attendanceId) {
  return await prisma.attendance.delete({
    where: { id: attendanceId },
  });
}
