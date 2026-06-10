import { axiosAuth } from './api';

export const updateProfile = async (userId, formData) => {
  return await axiosAuth.put(`/users/${userId}/profile`, formData, {
    headers: { 'Content-Type': undefined },
  });
};