import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IUser } from 'app/shared/model/user.model';
import { getUsersAsAdmin, getUser, createUser, updateUser, deleteUser } from 'app/modules/admin/user-management/user-management.reducer';

export const useUserManagement = () => {
  const dispatch = useAppDispatch();
  const { users, loading, totalItems, user, updating, errorMessage } = useAppSelector(state => state.userManagement);

  const loadUsers = useCallback(
    (page = 0, size = 10, sort = 'id,asc', login?: string, role?: string, status?: string) => {
      return dispatch(getUsersAsAdmin({ page, size, sort, login, role, status })).unwrap();
    },
    [dispatch],
  );

  const getUserById = useCallback(
    (login: string) => {
      return dispatch(getUser(login)).unwrap();
    },
    [dispatch],
  );

  const createNewUser = useCallback(
    (userData: IUser) => {
      return dispatch(createUser(userData)).unwrap();
    },
    [dispatch],
  );

  const updateExistingUser = useCallback(
    (userData: IUser) => {
      return dispatch(updateUser(userData)).unwrap();
    },
    [dispatch],
  );

  const deleteUserByLogin = useCallback(
    (login: string) => {
      return dispatch(deleteUser(login)).unwrap();
    },
    [dispatch],
  );

  return {
    users,
    user,
    loading,
    updating,
    errorMessage,
    totalItems,
    loadUsers,
    getUserById,
    createUser: createNewUser,
    updateUser: updateExistingUser,
    deleteUser: deleteUserByLogin,
  };
};
