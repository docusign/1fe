import { useEffect, useState } from 'react';
// import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

// import { getShellLogger } from '../utils/telemetry';

// import BrokenPage from './resources/brokenPage.json';
import { showImportMapOverrideButton } from '../init/import-map-ui';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';
import { PluginConfig } from '../types/widget-config';
import { getPluginBaselineUrl } from '../configs/config-helpers';
import { reloadPage } from '../utils/url';

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
  plugin?: PluginConfig;
  message?: string | undefined;
  hideMainButton?: boolean;
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
  message,
  hideMainButton,
}: ErrorProps) => {
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  // const logger = getShellLogger(plugin?.widgetId);

  useEffect(() => {
    // const { FEATURE_FLAGS, ENVIRONMENT } = getEnvironmentConfigs();

    // if (
    //   __SHOW_DEVTOOL__ &&
    //   FEATURE_FLAGS.enable1dsDevtool &&
    //   isIntegrationEnvironment(ENVIRONMENT)
    // ) {
      // if we hit this error boundary, it is likely the shell will not be able to render the devtool widget.
      // We should show the import map override button to allow the user to fix any import map urls.
      showImportMapOverrideButton();
    // }

    // logger.log({
    //   message: '[1DS-Shell] error page rendered',
    //   errorComponent: {
    //     type,
    //     plugin,
    //     message,
    //     hideMainButton,
    //   },
    // });

    // We should flush this log right away, users will often navigate away after an error page and the request *might* get canceled
    // KazMon sdk flushes on beforeUnload events but this is not 100% reliable in all browsers and scenarios.
    // logger.flush();

    if (plugin) {
      const isProd = readMagicBoxShellConfigs().mode === 'production';
      const pluginBaselineUrl = getPluginBaselineUrl(plugin);

      setTimeout(() => {
        if (isProd && pluginBaselineUrl) {
          window.location.href = pluginBaselineUrl;
        }
      }, 2000);
    }
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

  const errorOnClick = () => {
    switch (type) {
      case 'error':
        reloadPage({
          bustDocumentServiceWorkerCache: true,
        });
        break;
      case 'notFound':
        navigate(-1);
        break;
      case 'authCallbackError':
        // Navigate back to plugin
        if (plugin) {
          navigate(plugin.route);
        }
        break;
      default:
        reloadPage({
          bustDocumentServiceWorkerCache: true,
        });
        break;
    }
  };

  const mainText = message ?? ErrorPageData[type].titleText;
  const subText = ErrorPageData[type].subText;
  const buttonText = ErrorPageData[type].buttonText;

  return (
    <>
      <AnimationContainer>
        <SideLine />
        {/* <Lottie
          animationData={BrokenPage}
          data-qa={`broken.line.animation${complete ? '.complete' : ''}`}
          loop={false}
          onComplete={() => setComplete(true)}
          aria-hidden='true'
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
          }}
          style={{
            width: '100%',
            height: '200px',
            minWidth: '20px',
            maxWidth: '480px',
            margin: '0 -1px 0',
            flexShrink: 0,
          }}
        /> */}
        <SideLine />
      </AnimationContainer>

      <PageContainer>
        <div>
          <MainText data-qa={`shell.${type}.page.header`}>{mainText}</MainText>

          <SubText>{subText}</SubText>

          {!hideMainButton && (
            <button
              onClick={errorOnClick}
              data-qa={`shell.${type}.main.btn`}
            >{buttonText}</button>
          )}
        </div>
      </PageContainer>
    </>
  );
};
