/** @jsxImportSource @emotion/react */

import { GetTitle } from './getTitle';
import { SetTitle } from './setTitle';
import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';
// import { useTranslate } from 'src/locales';

/**
 * Experience Utility examples
 */
export const Experience: React.FC = () => {
  // const t = useTranslate();

  return (
    <div css={utilSectionStyles} data-qa='utils.experience.container'>
      {/* <h1>{t('Components.Experience.Index')}</h1> */}
      <h1>utils.experience</h1>
      <SetTitle />
      <GetTitle />
    </div>
  );
};
