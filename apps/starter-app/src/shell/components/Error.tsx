import React, { useEffect } from 'react';
// import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { shellLogger } from '../logger';

// import BrokenPage from './resources/brokenPage.json';
// import { PluginConfig } from '../types/widget-config';

const PageContainer = styled.div({
  fontFamily: 'DSIndigo',
  margin: '4vh auto',
  width: '100%',
  maxWidth: '80vw',
  height: 'auto',
  display: 'flex',
  justifyContent: 'center',
});

const AnimationContainer = styled.div({
  height: '200px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '@media only screen and (max-width: 480px)': {
    line: {
      display: 'none',
    },
  },
});

const MainText = styled.h1({
  margin: 0,
});

const SubText = styled.p({
  fontSize: '1rem',
  lineHeight: 1.5,
  marginTop: '8px',
});

type ErrorPageType = 'error' | 'notFound' | 'authCallbackError';

type ErrorPageData = {
  [key in ErrorPageType]: {
    titleText: string;
    subText: string;
    buttonText: string;
  };
};

type ErrorProps = {
  type?: ErrorPageType;
  // TODO[1fe]: NO ANY
  plugin?: any;
  message?: string | undefined;
};

// The SideLine is a SVG that helps keep the animation at the proper aspect ratio while still being responsive on larger screens. It looks like a continuation of the animation and is on both the left and right side of the animation
const SideLine = () => {
  return (
    <svg
      width='100%'
      height='200'
      viewBox='0 0 1500 200'
      preserveAspectRatio='none'
      aria-hidden='true'
    >
      <g>
        <line
          // Uses inline style for color to prevent Dark Mode issues
          style={{ stroke: '#6F56FF' }}
          strokeWidth='10'
          x1='0'
          y1='100'
          x2='1500'
          y2='100'
        />
      </g>
    </svg>
  );
};

export const Error = ({
  type = 'error',
  plugin,
  message
}: ErrorProps) => {
//   const logger = getShellLogger(plugin?.widgetId);

  useEffect(() => {
    shellLogger.log({
      message: '[1DS-Shell] error page rendered',
      errorComponent: {
        type,
        plugin,
        message,
      },
    });

    // We should flush this log right away, users will often navigate away after an error page and the request *might* get canceled
    // KazMon sdk flushes on beforeUnload events but this is not 100% reliable in all browsers and scenarios.
    // logger.flush();
  }, []);

  const ErrorPageData: ErrorPageData = {
    error: {
      titleText: 'An error has occurred',
      subText: 'Make sure your connection is stable and try again',
      buttonText: 'Try Again',
    },
    notFound: {
      titleText: 'Looks like this page is not here',
      subText: 'Check your URL, or go back',
      buttonText: 'Go Back',
    },
    authCallbackError: {
      titleText: 'Something went wrong',
      subText: 'Make sure your connection is stable and try again',
      buttonText: 'Try Again',
    },
  };

  const mainText = message ?? ErrorPageData[type].titleText;
  const subText = ErrorPageData[type].subText;

  return (
    <>
      <AnimationContainer>
        <SideLine />
      </AnimationContainer>

      <PageContainer>
        <div>
          <MainText data-qa={`shell.${type}.page.header`}>{mainText}</MainText>

          <SubText>{subText}</SubText>
        </div>
      </PageContainer>
    </>
  );
};
