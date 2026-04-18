'use client';

export const useUserRoleActions = () => {
  const updateUserRole = async (uuid: string, role: string) => {
    await fetch(`/api/proxy/forms/users/${uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
  };

  return { updateUserRole };
};
