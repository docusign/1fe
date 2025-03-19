import { major } from 'semver';
import { engines } from '../../package.json';

export const checkNodeVersion = async () => {
  const currentMajorNodeVersion = major(process.version);
  const requiredMajorNodeVersion = major(engines.node);

  if (currentMajorNodeVersion !== requiredMajorNodeVersion) {
    throw new Error(
      `Your detected major node version, ${currentMajorNodeVersion} does not match the major node version used by the 1FE ecosystem, ${requiredMajorNodeVersion}`,
    );
  }
};
