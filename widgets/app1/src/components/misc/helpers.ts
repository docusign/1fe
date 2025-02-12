// This util is only to be used by the 1DS team for our e2e tests.
// If you are looking for this functionality to read cookies on the client, please reach out to #1ds-help.
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [key, value] = cookie.split('=').map((c) => c.trim());
    if (key === name) {
      return value;
    }
  }
  return null;
};
