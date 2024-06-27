import { sendpulseApi } from './instance';

const authAPI = async () => {
  const { data } = await sendpulseApi.post('/oauth/access_token', {
    grant_type: 'client_credentials',
    client_id: import.meta.env.VITE_SENDPULSE_CLIENT_ID,
    client_secret: import.meta.env.VITE_SENDPULSE_CLIENT_SECRET,
  });

  sendpulseApi.defaults.headers.common.Authorization = `${data.token_type} ${data.access_token}`;

  return data;
};

const getWebsites = async () => {
  const { data } = await sendpulseApi.get('/push/websites');

  return data;
};

export { authAPI, getWebsites };
