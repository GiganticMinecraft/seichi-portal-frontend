'use server';

import { responseJsonOrErrorResponse } from '@/features/api/responseOrErrorResponse';
import type { User } from '../types/userSchema';

const apiServerUrl = 'http://localhost:9000';

export const getUser = async (token: string) => {
  const response = await fetch(`${apiServerUrl}/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return responseJsonOrErrorResponse<User>(response);
};
