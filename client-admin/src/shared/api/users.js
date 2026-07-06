import { axiosAuth } from './api';

// GET /api/v1/users — requiere ADMIN_ROLE
export const getAllUsers = async () => {
    return await axiosAuth.get('/users');
};

// PUT /api/v1/users/:userId/role?roleName=... — requiere ADMIN_ROLE
export const updateUserRole = async (userId, roleName) => {
    return await axiosAuth.put(`/users/${userId}/role`, null, {
        params: { roleName },
    });
};