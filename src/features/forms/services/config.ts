import aspida from '@aspida/axios';
import axios from 'axios';

import api from '@/api/$api';
import { API_URL } from '@/config';

export const apiClient = api(aspida(axios.create({ baseURL: API_URL })));
