# skillsprint-api

```js
import {
  courses,
  getCourseById,
  getCoursesByLecturerId,
  getCoursesByStudentId,
  getAvailableCoursesForStudent,
} from "@/data/courses";
import {
  attendanceRecords,
  getAttendanceRecordsByCourseAndDate,
  getAttendanceRecordsByCourseAndMonth,
  getAttendanceRecordsByStudentAndCourse,
  getAttendanceRecordsByStudentAndMonth,
  getAttendanceRecordsByCourseId,
  getAttendanceRecordsByStudentId,
  calculateStudentAttendanceStats,
  calculateCourseAttendanceStats,
} from "@/data/attendance";
import {
  adminStats,
  adminOverviewData,
  lecturerStats,
  studentStats,
} from "@/data/stats";
import { mockFetch } from "./mock-utils";
import { User, Course, Attendance, Role, AuthResponse } from "@/types";
```
