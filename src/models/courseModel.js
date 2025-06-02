import { prisma } from '../config/prismaClient.js';

/**
 * Get all courses with optional filtering
 */
export async function getAllCourses(filter = {}) {
  return await prisma.course.findMany({
    where: filter,
  });
}

/**
 * Get a course by ID
 */
export async function getCourseById(id) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Create a new course
 */
export async function createCourse(courseData) {
  const data = {
    title: courseData.title,
    description: courseData.description,
    price: courseData.price,
    duration: courseData.duration,
    category: courseData.category,
    startDate: courseData.startDate ? new Date(courseData.startDate) : null,
    coverImage: courseData.coverImage,
    admin: {
      connect: { id: courseData.adminId },
    },
  };

  // Include optional fields if they are provided
  if (courseData.level) {
    data.level = courseData.level;
  }
  if (courseData.endDate) {
    data.endDate = new Date(courseData.endDate);
  }
  if (courseData.instructorId) {
    data.instructor = {
      connect: { id: courseData.instructorId },
    };
  }

  return await prisma.course.create({
    data,
  });
}

/**
 * Update an existing course
 */
export async function updateCourse(id, courseData) {
  return await prisma.course.update({
    where: { id },
    data: courseData,
  });
}

/**
 * Delete a course
 */
export async function deleteCourse(id) {
  return await prisma.course.delete({
    where: { id },
  });
}

// check if a user has enrolled in this course using courseId

export async function checkEnrollment(courseId, userId) {
  return await prisma.enrollment.findFirst({
    where: {
      courseId,
      userId,
    },
  });
}

/**
 * Enroll a student in a course
 */
export async function enrollStudent(courseId, userId) {
  // Check for existing active enrollments
  const hasEnrolled = await checkEnrollment(courseId, userId);
  if (hasEnrolled) {
    throw new Error('User already has enrolled in this course');
  }

  return await prisma.enrollment.create({
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

/**
 * Get all enrollments for a course
 */
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
