import Cookies from 'js-cookie';

const SESSION_ID = `1fe_session_id`;

export const getSessionIdFromCookie = (): string | undefined => {
  return Cookies.get(SESSION_ID);
};
