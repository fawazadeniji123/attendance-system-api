import { prisma } from '../config/prismaClient.js';

export async function getAttendanceByCourse(courseId, { day, month, year }) {
  const start = new Date(year, month, day, 0, 0, 0);
  const end = new Date(year, month, day, 23, 59, 59, 999);
  return await prisma.attendance.findMany({
    where: {
      courseId: courseId,
      timestamp: {
        gte: start,
        lte: end,
      },
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          }, // Include student user details if needed
        },
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
}

export async function createAttendanceRecord(attendanceData) {
  const studentId = attendanceData.studentId;
  const courseId = attendanceData.courseId;
  const status = attendanceData.status;
  const todayStart = new Date(attendanceData.date);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(attendanceData.date);
  todayEnd.setHours(23, 59, 59, 999);

  const existing = await prisma.attendance.findFirst({
    where: {
      studentId,
      courseId,
      timestamp: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (!existing) {
    return await prisma.attendance.create({
      data: {
        studentId,
        courseId,
        status,
        timestamp: new Date(attendanceData.date), // Ensure timestamp is set correctly
      },
    });
  }
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
