import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  getCourseEnrollments,
} from '../models/courseModel.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../config/multer.js';

/**
 * Get all courses
 */
export async function httpGetAllCourses(req, res) {
  try {
    const courses = await getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    return res.status(500).json({ error: 'Failed to retrieve courses' });
  }
}

/**
 * Create a new course
 */
export async function httpCreateCourse(req, res) {
  try {
    const {
      title,
      description,
      level,
      instructorId,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }

    if (!req.user) {
      return res.status(403).json({ error: 'User not available' });
    }

    if (req.user.role.name !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create courses' });
    }

    const courseData = {
      title,
      description,
      level,
      adminId: req.user.id, // The authenticated user is the admin
      instructorId,
    };

    const newCourse = await createCourse(courseData);
    return res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ error: 'Failed to create course' });
  }
}

/**
 * Update an existing course
 */
export async function httpUpdateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, instructorId } =
      req.body;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is the admin or instructor
    if (course.adminId !== req.user.id && req.user.role.name !== 'ADMIN') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to update this course' });
    }

    const courseData = {
      title,
      description,
      instructorId,
    };

    const updatedCourse = await updateCourse(id, courseData);
    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: 'Failed to update course' });
  }
}

/**
 * Delete a course
 */
export async function httpDeleteCourse(req, res) {
  try {
    const { id } = req.params;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is the admin
    if (course.adminId !== req.user.id && req.user.role.name !== 'ADMIN') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this course' });
    }

    await deleteCourse(id);
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
}

/**
 * Enroll a student in a course
 */
export async function httpEnrollInCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Enroll the student
    const enrollment = await enrollStudent(id, userId);
    return res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);

    // Handle specific error case
    if (error.message.includes('active course enrollment')) {
      return res.status(400).json({
        error:
          'You cannot enroll in a new course while enrolled in an active course',
      });
    }
    return res.status(500).json({ error: 'Failed to enroll in course' });
  }
}

/**
 * Check if user is enrolled in a course
 */

export async function httpGetActiveEnrollments(req, res) {
  try {
    const userId = req.user.id;

    const activeEnrollment = await checkActiveEnrollments(userId);
    return res.status(200).json({
      hasActive: activeEnrollment,
    });
  } catch (error) {
    console.error('Error checking course enrollment:', error);
    return res
      .status(500)
      .json({ error: 'Failed to check course enrollment status' });
  }
}
/**
 * Get enrollments for a course
 */
export async function httpGetCourseEnrollments(req, res) {
  try {
    const { id } = req.params;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is authorized to view enrollments
    if (course.adminId !== req.user.id && req.user.role.name !== 'ADMIN') {
      return res.status(403).json({
        error: "You are not authorized to view this course's enrollments",
      });
    }

    const enrollments = await getCourseEnrollments(id);
    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error getting course enrollments:', error);
    return res
      .status(500)
      .json({ error: 'Failed to retrieve course enrollments' });
  }
}
