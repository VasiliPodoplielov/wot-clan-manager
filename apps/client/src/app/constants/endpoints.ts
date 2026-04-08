const BASE_API_URL = 'http://localhost:3000';
const BASE_AUTH_URL = `${BASE_API_URL}/auth`;
const BASE_WARGAMING_API_URL = `${BASE_API_URL}/wargaming`;

export const endpoints = {
  auth: {
    login: `${BASE_AUTH_URL}/login`,
    register: `${BASE_AUTH_URL}/register`,
  },
  wargaming: {
    clanMembers: `${BASE_WARGAMING_API_URL}/clan-members`,
  },
};
