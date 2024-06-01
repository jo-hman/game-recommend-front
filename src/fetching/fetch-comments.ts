import axios from 'axios';

import type { Comment } from '../types';

import { apiBaseUrl } from '../utils/api';

const fetchComments = async (id: string, jwt: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/games/${id}/comments`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return data as Comment[];
  } catch (error) {
    return null;
  }
};

export { fetchComments };
