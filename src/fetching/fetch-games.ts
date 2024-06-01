import axios from 'axios';

import type { GameBundle } from '../types';

import { apiBaseUrl } from '../utils/api';

const fetchGameBundles = async (jwt: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/games`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return data as GameBundle[];
  } catch (error) {
    return [] as GameBundle[];
  }
};

export { fetchGameBundles };
