import { prisma } from '../config/prismaClient.js';

export async function getAllCourses(filter = {}) {
  return await prisma.course.findMany({
    where: filter,
    include: {
      lecturer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getCourseById(id) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      lecturer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
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
  let data = {};
  if (courseData.title) {
    data.title = courseData.title;
  }
  if (courseData.description) {
    data.description = courseData.description;
  }
  if (courseData.code) {
    data.code = courseData.code;
  }
  if (courseData.lecturerId) {
    data.lecturer = {
      connect: { id: courseData.lecturerId },
    };
  }
  return await prisma.course.update({
    where: { id },
    data,
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
      course: {
        include: {
          lecturer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
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

export async function unenrollStudent(courseId, studentId) {
  return await prisma.enrollment.delete({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });
}

export async function getCourseEnrollments(courseId) {
  return await prisma.enrollment.findMany({
    where: { courseId },
    select: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
    include: {
      lecturer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function getCoursesByLecturerId(lecturerId) {
  return await prisma.course.findMany({
    where: { lecturerId },
    include: {
      lecturer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}
