import React, { useEffect } from 'react';
import { OneFEErrorComponentProps } from '../types/one-fe-shell-options';
import { getShellLogger } from '../utils/telemetry';

type ErrorPageType = 'error' | 'notFound';

type ErrorPageData = {
  [key in ErrorPageType]: {
    titleText: string;
    subText: string;
    buttonText: string;
  };
};

type ErrorProps = {
  type?: ErrorPageType;
  plugin?: OneFEErrorComponentProps['plugin'];
  message?: string | undefined;
};

export const GenericError = (errorProps?: ErrorProps) => {
  const { type = 'error', plugin, message } = errorProps || {};

  useEffect(() => {
    const shellLogger = getShellLogger();

    shellLogger.log({
      message: '[1FE-Shell] error page rendered',
      errorComponent: {
        type,
        plugin,
        message,
      },
    });
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
  };

  const mainText = message ?? ErrorPageData[type].titleText;
  const subText = ErrorPageData[type].subText;

  return (
    <>
      <h1>{mainText}</h1>
      <p>{subText}</p>
    </>
  );
};

export const getGenericError = (genericErrorProps?: ErrorProps) => {
  return <GenericError {...genericErrorProps} />;
};
