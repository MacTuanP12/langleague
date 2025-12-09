import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '../model/models';

const apiUrl = '/api/admin/users';

// AdminUserDTO to match backend
export interface AdminUserDTO {
  id?: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  imageUrl?: string;
  activated?: boolean;
  langKey?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  authorities?: string[];
  password?: string; // Only for creation
}

// Response types
interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Get all users (Admin only) - Matches GET /api/admin/users
export const getUsers = createAsyncThunk(
  'user/fetch_all',
  async ({ page = 0, size = 20, sort = 'id,asc' }: { page?: number; size?: number; sort?: string } = {}) => {
    try {
      const response = await axios.get<AdminUserDTO[]>(apiUrl, {
        params: { page, size, sort },
      });
      // Backend returns array directly with X-Total-Count header (case insensitive)
      const totalCount = response.headers['x-total-count'] || response.headers['X-Total-Count'] || '0';
      const totalElements = parseInt(totalCount, 10);
      const dataArray = Array.isArray(response.data) ? response.data : [];
      return {
        content: dataArray,
        totalElements: totalElements || dataArray.length,
        totalPages: Math.ceil((totalElements || dataArray.length) / size),
        size,
        number: page,
      };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
);

// Get user by login - Matches GET /api/admin/users/{login}
export const getUser = createAsyncThunk('user/fetch_entity', async (login: string) => {
  const response = await axios.get<AdminUserDTO>(`${apiUrl}/${login}`);
  return response.data;
});

// Create user (Admin only) - Matches POST /api/admin/users
export const createUser = createAsyncThunk('user/create_entity', async (user: any) => {
  try {
    const userDTO: AdminUserDTO = {
      login: user.login || '',
      email: user.email || '',
      firstName: user.firstName,
      lastName: user.lastName,
      activated: user.activated !== undefined ? user.activated : true,
      authorities: user.authorities || ['ROLE_USER'],
      langKey: user.langKey || 'en',
      password: user.password, // Include password for new users
    };
    const response = await axios.post<AdminUserDTO>(apiUrl, userDTO);
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
});

// Update user (Admin only) - Matches PUT /api/admin/users or PUT /api/admin/users/{login}
export const updateUser = createAsyncThunk('user/update_entity', async (user: IUser | AdminUserDTO) => {
  try {
    if (!user.login) {
      throw new Error('User login is required for update');
    }
    const userDTO: AdminUserDTO = {
      id: user.id,
      login: user.login || '',
      email: user.email || '',
      firstName: user.firstName,
      lastName: user.lastName,
      activated: user.activated,
      authorities: user.authorities,
      langKey: user.langKey || 'en',
    };
    const response = await axios.put<AdminUserDTO>(`${apiUrl}/${user.login}`, userDTO);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw error;
  }
});

// Delete user (Admin only) - Matches DELETE /api/admin/users/{login}
export const deleteUser = createAsyncThunk('user/delete_entity', async (login?: string) => {
  try {
    if (!login) {
      throw new Error('User login is required for deletion');
    }
    await axios.delete(`${apiUrl}/${login}`);
    return { login };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
});

// Lock user account - Matches PUT /api/admin/users/{login}/lock
export const lockUser = createAsyncThunk('user/lock', async (login: string) => {
  await axios.put(`${apiUrl}/${login}/lock`);
  return { login };
});

// Unlock user account - Matches PUT /api/admin/users/{login}/unlock
export const unlockUser = createAsyncThunk('user/unlock', async (login: string) => {
  await axios.put(`${apiUrl}/${login}/unlock`);
  return { login };
});

// Activate user - Matches PUT /api/admin/users/{login}/activate
export const activateUser = createAsyncThunk('user/activate', async (login: string) => {
  const response = await axios.put<AdminUserDTO>(`${apiUrl}/${login}/activate`);
  return response.data;
});

// Deactivate user - Matches PUT /api/admin/users/{login}/deactivate
export const deactivateUser = createAsyncThunk('user/deactivate', async (login: string) => {
  const response = await axios.put<AdminUserDTO>(`${apiUrl}/${login}/deactivate`);
  return response.data;
});

// Get authorities (roles) - Matches GET /api/authorities
export const getAuthorities = createAsyncThunk('user/fetch_authorities', async () => {
  try {
    const response = await axios.get<string[]>('/api/authorities');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching authorities:', error);
    return ['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN'];
  }
});

// Get current user info - Matches GET /api/account
export const getCurrentUser = createAsyncThunk('user/fetch_current', async () => {
  const response = await axios.get<IUser>('/api/account');
  return response.data;
});

// Update current user profile - Matches POST /api/account
export const updateCurrentUser = createAsyncThunk('user/update_current', async (user: Partial<IUser>) => {
  const response = await axios.post<IUser>('/api/account', user);
  return response.data;
});
