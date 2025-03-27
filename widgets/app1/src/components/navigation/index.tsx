/** @jsxImportSource @emotion/react */

// import { WidgetProps } from 'src/contract';
import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';
// import { useTranslate } from 'src/locales';

import { ExternalRedirect } from './externalRedirect';
import { GetAbsoluteWidgetPath } from './getAbsoluteWidgetPath';
import { GetPluginRoute } from './getPluginRoute';
import { GetRoute } from './getRoute';
import { Go } from './go';
import { PreLoadUrl } from './preLoadUrl';
import { UseNavigate } from './useNavigate';

// TODO: strongly type
export const Navigation = () => {
  // const t = useTranslate();
  return (
    <div css={utilSectionStyles} data-qa='utils.experiments.container'>
      <h1>utils.navigation</h1>
      {/* <h1>{t('Components.Navigation.Index')}</h1> */}
      <UseNavigate />
      <GetRoute />
      <GetPluginRoute />
      <GetAbsoluteWidgetPath />
      <ExternalRedirect />
      <PreLoadUrl />
      <Go />
    </div>
  );
};
