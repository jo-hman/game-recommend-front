import axios from 'axios';

import { apiBaseUrl } from '../utils/api';

type AverageData = {
  average: number;
  count: number;
};

const fetchScore = async (id: string, jwt: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/games/${id}/scores`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    return data as AverageData;
  } catch (error) {
    return { average: 0, count: 0 } as AverageData;
  }
};

export { fetchScore };
