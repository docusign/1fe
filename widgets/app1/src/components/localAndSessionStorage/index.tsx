/** @jsxImportSource @emotion/react */

import React from 'react';

import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';

import { LocalAndSessionStorage1FE } from './localAndSessionStorage1FE';

export const LocalAndSessionStorage: React.FC = () => {
  return (
    <div css={utilSectionStyles} data-qa='utils.experiments.container'>
      <h1>{'utils.localStorage / utils.sessionStorage'}</h1>
      <LocalAndSessionStorage1FE />
    </div>
  );
};
