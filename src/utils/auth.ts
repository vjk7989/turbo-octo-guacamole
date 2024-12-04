import { User, Credentials, UserWithPassword } from '../types/auth';
import { dbService } from './db';

export const mockLogin = async (credentials: Credentials): Promise<User> => {
  try {
    const user = await dbService.users.findByUsername(credentials.username);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const users = await dbService.users.findAll();
  return users.map(({ password, ...user }) => user);
};

export const getAllUsersWithPasswords = async (): Promise<UserWithPassword[]> => {
  return dbService.users.findAll();
};

export const addUser = async (user: Omit<UserWithPassword, 'id'>): Promise<User> => {
  const newUser = await dbService.users.insert(user);
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    await dbService.users.updatePassword(userId, newPassword);
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await dbService.users.delete(userId);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};