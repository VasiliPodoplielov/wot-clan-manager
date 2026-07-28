const BASE_API_URL = 'http://localhost:3000';
const BASE_AUTH_URL = `${BASE_API_URL}/auth`;
const BASE_WARGAMING_API_URL = `${BASE_API_URL}/wargaming`;
const BASE_EVENTS_API_URL = `${BASE_API_URL}/events`;
const BASE_APPLICATIONS_API_URL = `${BASE_API_URL}/applications`;
const BASE_USERS_API_URL = `${BASE_API_URL}/users`;

export const endpoints = {
  auth: {
    login: `${BASE_AUTH_URL}/login`,
    register: `${BASE_AUTH_URL}/register`,
  },
  wargaming: {
    clanMembers: `${BASE_WARGAMING_API_URL}/clan-members`,
  },
  events: {
    active: `${BASE_EVENTS_API_URL}/active`,
  },
  applications: {
    create: BASE_APPLICATIONS_API_URL,
    mine: `${BASE_APPLICATIONS_API_URL}/mine`,
  },
  users: {
    list: BASE_USERS_API_URL,
    updateRole: (id: number) => `${BASE_USERS_API_URL}/${id}/role`,
  },
};
