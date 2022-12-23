import Axios from 'axios';

export const axios = Axios.create({
  timeout: 7000,
  // transformResponse: [
  //   (data) => JSON.stringify(camelcaseKeys(data, { deep: true }), null, 2),
  // ],
});
