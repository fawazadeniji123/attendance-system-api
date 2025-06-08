import { prisma } from '../config/prismaClient.js';

export async function getAllCourses(filter = {}) {
  return await prisma.course.findMany({
    where: filter,
  });
}

export async function getCourseById(id) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      lecturer: true,
    },
  });
}

export async function createCourse(courseData) {
  const data = {
    title: courseData.title,
    description: courseData.description,
    code: courseData.code,
    lecturer: {
      connect: { id: courseData.lecturerId },
    },
  };

  return await prisma.course.create({
    data,
  });
}

export async function updateCourse(id, courseData) {
  return await prisma.course.update({
    where: { id },
    data: courseData,
  });
}

export async function deleteCourse(id) {
  return await prisma.course.delete({
    where: { id },
  });
}

export async function getStudentEnrollments(studentId) {
  return await prisma.enrollment.findMany({
    where: { studentId },
    select: {
      course: true,
    },
  });
}

export async function enrollStudent(courseId, studentId) {
  return await prisma.enrollment.create({
    data: {
      student: { connect: { id: studentId } },
      course: { connect: { id: courseId } },
    },
  });
}

export async function getCourseEnrollments(courseId) {
  return await prisma.enrollment.findMany({
    where: { courseId },
    select: {
      student: {
        include: {
          user: true, // include user info (e.g. name, email) if needed
        },
      },
    },
  });
}


export async function getAvailableCoursesByStudentId(studentId) {
  return await prisma.course.findMany({
    where: {
      NOT: {
        enrollments: {
          some: {
            studentId: studentId,
          },
        },
      },
    },
  });
}

export async function getCoursesByLecturerId(lecturerId) {
  return await prisma.course.findMany({
    where: { lecturerId },
  });
}