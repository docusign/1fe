/** @jsxImportSource @emotion/react */

import React from 'react';

import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';
// import { useTranslate } from 'src/locales';

import { Get } from './get';

export const Widgets: React.FC = (props) => {
  // const t = useTranslate();
  return (
    <div css={utilSectionStyles} data-qa='utils.widgets.container'>
      <h1>utils.widgets</h1>
      {/* <h1>{t('Components.Widgets.Index')}</h1> */}
      <Get {...props} />
    </div>
  );
};
