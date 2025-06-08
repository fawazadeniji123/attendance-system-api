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

export async function getCourseEnrollments(userId) {
  return await prisma.course.findMany({
    where: {
      some: {
        userId,
      },
    },
  });
}

export async function enrollStudent(courseId, userId) {
  return await prisma.course.create({
    data: {
      courseId,
      userId,
    },
    include: {
      course: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getCourseEnrollments(courseId) {
  return await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
