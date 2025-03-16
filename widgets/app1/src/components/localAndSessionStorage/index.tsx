/** @jsxImportSource @emotion/react */

/* eslint-disable docusign-i18n/no-hard-coded-text */
import React from 'react';

import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';

import { LocalAndSessionStorage1FE } from './localAndSessionStorage1FE';

export const LocalAndSessionStorage: React.FC = (props) => {
  return (
    <div css={utilSectionStyles} data-qa="utils.experiments.container">
      <h1>{'utils.localStorage / utils.sessionStorage'}</h1>
      <LocalAndSessionStorage1FE {...props} />
    </div>
  );
};
