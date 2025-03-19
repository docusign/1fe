import { getOneFeApi } from './oneFeServerApi';

export async function getVersions() {
  const api = await getOneFeApi();

  const versions = await api.server.get('versions').json();
}
