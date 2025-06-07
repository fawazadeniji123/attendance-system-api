import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserByMatricNumber } from '../models/authModel.js';
import { config as env } from '../config/env.js';

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
}

export async function signUp(req, res) {
  const {
    name,
    email,
    password,
    role,
    matricNumber,
    faceEncoding,
    pictureIds,
    courseIds,
  } = req.body;

  // If student data is provided, include it in the user creation
  const studentData =
    role.toUpperCase() === 'STUDENT'
      ? {
          matricNumber,
          faceEncoding: faceEncoding || [],
          pictureIds: pictureIds || [],
          courseIds: courseIds || [],
        }
      : undefined;
  // If lecturer data is provided, include it in the user creation
  const lecturerData =
    role.toUpperCase() === 'LECTURER'
      ? { courseIds: courseIds || [] }
      : undefined;

  const userData = {
    name,
    email,
    password,
    role,
    studentData,
    lecturerData,
  };

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Please provide all required fields' });
    }

    if (role == 'STUDENT' && !matricNumber) {
      return res
        .status(400)
        .json({ error: 'Matric number is required for students' });
    }

    // Check if email is already in use
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    if (role == 'STUDENT') {
      const existingMatric = await findUserByMatricNumber(matricNumber);
      if (existingMatric) {
        return res.status(409).json({ error: 'Matric number is already in use' });
      }
    }

    // If not in use, proceed with user creation
    const newUser = await createUser(userData);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie('accessToken', accessToken, { httpOnly: false, secure: false });
    res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function signIn(req, res) {
  // Passport authentication middleware handles sign-in
  const accessToken = generateAccessToken(req.user);
  const refreshToken = generateRefreshToken(req.user);

  res.cookie('accessToken', accessToken, { httpOnly: true, secure: false });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

  res.json({
    message: 'Login successful',
    user: req.user,
  });
}

export async function refreshAccessToken(req, res) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);

    const accessToken = generateAccessToken(user);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false });
    // res.json({ accessToken });
  });
}

export async function signOut(_req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}
