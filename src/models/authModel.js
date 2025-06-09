import bcrypt from 'bcrypt';
import { prisma } from '../config/prismaClient.js';

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      student: data?.studentData
        ? {
            create: {
              matricNumber: data.studentData.matricNumber,
              faceEncoding: JSON.stringify(data.studentData.faceEncoding),
              pictureIds: data.studentData.pictureIds,
            },
          }
        : undefined,
      lecturer: data?.lecturerData
        ? {
            create: {
              courses: {
                connect: data.lecturerData.courseIds,
              },
            },
          }
        : undefined,
    },
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function findStudentWithUser(matricNumber) {
  return prisma.student.findUnique({
    where: { matricNumber },
    include: { user: true },
    omit: {
      user: { password: true },
    },
  });
}

export async function findUserByMatricNumber(matricNumber) {
  return await prisma.user.findFirst({
    where: { student: { matricNumber } },
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function findUserWithPassword(email) {
  return await prisma.user.findUnique({
    where: { email },
    omit: {
      password: false,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}

export async function getAllStudents() {
  return await prisma.user.findMany({
    where: { role: 'STUDENT' },
    omit: {
      password: true,
    },
    include: {
      student: true,
    },
  });
}

export async function getAllLecturers() {
  return await prisma.user.findMany({
    where: { role: 'LECTURER' },
    omit: {
      password: true,
    },
    include: {
      lecturer: true,
    },
  });
}

export async function updateUser(id, data) {
  const { studentData, lecturerData, ...rest } = data;

  return await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      student: studentData
        ? {
            update: {
              ...studentData,
            },
          }
        : undefined,
      lecturer: lecturerData
        ? {
            update: {
              ...lecturerData,
            },
          }
        : undefined,
    },
    omit: {
      password: true,
    },
  });
}


export async function deleteUser(id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) throw new Error('User not found');

  if (user.student) {
    await prisma.student.delete({ where: { id: user.student.id } });
  }

  if (user.lecturer) {
    await prisma.lecturer.delete({ where: { id: user.lecturer.id } });
  }

  return await prisma.user.delete({ where: { id } });
}

export async function approveUser(id) {
  return await prisma.user.update({
    where: { id },
    data: { isApproved: true },

    omit: {
      password: true,
    },
  });
}

export async function rejectUser(id) {
  return await prisma.user.update({
    where: { id },
    data: { isApproved: false },

    omit: {
      password: true,
    },
  });
}

export async function getRecentUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    omit: {
      password: true,
    },
    include: {
      student: true,
      lecturer: true,
    },
  });
}
