import {
  getAllUsers,
  getAllLecturers,
  getAllStudents,
  getRecentUsers,
  updateUser,
  deleteUser,
  findUserById,
  approveUser,
  rejectUser,
} from '../models/authModel.js';

export async function httpGetAllUsers(_req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpGetLecturerUsers(_req, res) {
  try {
    const users = await getAllLecturers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpGetStudentUsers(_req, res) {
  try {
    const users = await getAllStudents();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpGetRecentUsers(_req, res) {
  try {
    const users = await getRecentUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpGetUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpUpdateUser(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedUser = await updateUser(id, data);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpDeleteUser(req, res) {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpAddFaceEncoding(req, res) {
  const user = req.user;
  const { faceEncoding } = req.body;

  if (!faceEncoding) {
    return res.status(400).json({ error: 'Face encoding is required' });
  }

  try {
    await updateUser(user.id, { studentData: { faceEncoding: JSON.stringify(faceEncoding) } });
    res.json({
      message: 'Face encoding added successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpApproveUser(req, res) {
  const { id } = req.params;

  try {
    const user = await approveUser(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User approved successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpRejectUser(req, res) {
  const { id } = req.params;

  try {
    const user = await rejectUser(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User rejected successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function httpGetUserProfile(req, res) {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
