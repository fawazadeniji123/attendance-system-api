import {
  getAllCourses,
  getCourseById,
  getCoursesByLecturerId,
  getAvailableCoursesByStudentId,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
  getCourseEnrollments,
  getStudentEnrollments,
} from '../models/courseModel.js';
import { findUserById } from '../models/authModel.js';

export async function httpGetAllCourses(req, res) {
  try {
    const courses = await getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    return res.status(500).json({ message: 'Failed to retrieve courses' });
  }
}

export async function httpGetCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course by ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve course' });
  }
}

export async function httpGetCoursesByLecturerId(req, res) {
  try {
    const { lecturerId } = req.params;
    const courses = await getCoursesByLecturerId(lecturerId);
    if (!courses) {
      return res
        .status(404)
        .json({ message: 'No courses found for this lecturer' });
    }
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses by lecturer ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve courses' });
  }
}

export async function httpGetAvailableCoursesByStudentId(req, res) {
  try {
    const { studentId } = req.params;
    const courses = await getAvailableCoursesByStudentId(studentId);
    if (!courses) {
      return res
        .status(404)
        .json({ message: 'No available courses found for this student' });
    }
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting available courses by student ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve courses' });
  }
}

export async function httpCreateCourse(req, res) {
  try {
    const { title, code, description, lecturerId } = req.body;

    if (!title || !code) {
      return res
        .status(400)
        .json({ message: 'Course title and code are required' });
    }

    const courseData = {
      title,
      code,
      description,
      lecturerId,
    };

    const newCourse = await createCourse(courseData);
    return res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Failed to create course' });
  }
}

export async function httpUpdateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, lecturerId } = req.body;

    if (!title || !description || !lecturerId) {
      return res
        .status(400)
        .json({
          message: 'Course title, description, or lecturer ID are required',
        });
    }

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseData = {
      title,
      description,
      lecturerId,
    };

    const updatedCourse = await updateCourse(id, courseData);
    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'Failed to update course' });
  }
}

export async function httpDeleteCourse(req, res) {
  try {
    const { id } = req.params;

    await deleteCourse(id);
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ message: 'Failed to delete course' });
  }
}

export async function httpEnrollInCourse(req, res) {
  try {
    const { id } = req.params;
    const studentId = req.user.student.id;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Enroll the student
    const enrollment = await enrollStudent(id, studentId);
    return res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({ message: 'Failed to enroll in course' });
  }
}

export async function httpUnenrollInCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Unenroll the student
    await unenrollStudent(id, userId);
    return res.status(200).json({
      message: 'Successfully unenrolled from course',
    });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return res.status(500).json({ message: 'Failed to unenroll from course' });
  }
}

export async function httpGetStudentEnrollments(req, res) {
  try {
    const { studentId } = req.params;

    const courses = await getStudentEnrollments(studentId);
    if (!courses) {
      return res
        .status(404)
        .json({ message: 'No courses found for this student' });
    }
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting student enrollments:', error);
    return res
      .status(500)
      .json({ message: 'Failed to retrieve student enrollments' });
  }
}

export async function httpGetCourseEnrollments(req, res) {
  try {
    const { courseId } = req.params;

    const students = await getCourseEnrollments(courseId);
    if (!students) {
      return res
        .status(404)
        .json({ message: 'No students found for this course' });
    }
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error getting course enrollments:', error);
    return res
      .status(500)
      .json({ message: 'Failed to retrieve course enrollments' });
  }
}
