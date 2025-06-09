import { deleteUser, findUserById, updateUser } from '../models/authModel.js';

export async function httpGetProfile(req, res) {
  const userId = req.user.id;

  try {
    const profile = await findUserById(userId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'Failed to retrieve profile' });
  }
}

export async function httpUpdateProfile(req, res) {
  const userId = req.user.id;
  const profileData = req.body;

  try {
    const updatedProfile = await updateUser(userId, profileData);
    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
}

export async function httpDeleteProfile(req, res) {
  const userId = req.user.id;

  try {
    const deletedProfile = await deleteUser(userId);
    return res.status(200).json(deletedProfile);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ message: 'Failed to delete profile' });
  }
}