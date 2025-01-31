import Cookies from 'js-cookie';
import { ACTIVE_AUTOMATED_TEST_FRAMEWORK } from '../constants/cookie-names';

export const getIsActiveAutomatedTestFramework = (): string | undefined => {
  return Cookies.get(ACTIVE_AUTOMATED_TEST_FRAMEWORK);
};
