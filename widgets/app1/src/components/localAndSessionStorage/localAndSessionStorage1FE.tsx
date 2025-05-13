import { platformProps } from '@1fe/shell';
import { Button } from 'antd';
import { useState } from 'react';

import { ResultElementBoundary } from '../misc/resultElementBoundary';
// import { useTranslate } from 'src/locales';

export const LocalAndSessionStorage1FE = () => {
  type allowedTypes = string | boolean | number;
  // const t = useTranslate();

  const [result, setResult] = useState<allowedTypes>('');
  const [sessionResult, setSessionResult] = useState<allowedTypes>();
  const getResult = (key: string, value: allowedTypes) => {
    platformProps.utils.localStorage.set(key, value);
    setResult(platformProps.utils.localStorage.get(key).toString());
  };
  const getSessionResult = (key: string, value: allowedTypes) => {
    platformProps.utils.sessionStorage.set(key, value);
    setSessionResult(platformProps.utils.sessionStorage.get(key).toString());
  };

  return (
    <div data-qa='utils.localAndSessionStorage1FE.container'>
      <Button
        data-qa='utils.localAndSessionStorage1FE.localStorage.getBoolean.btn'
        onClick={() => getResult('key2', true)}
      >
        localStorageSetAndGetBoolean
        {/* {t('Components.LocalAndSessionStorage.LocalStorage1FE-GetBoolean')} */}
      </Button>
      <Button
        data-qa='utils.localAndSessionStorage1FE.localStorage.get.btn'
        onClick={() => getResult('key1', 'value1')}
      >
        localStorageSetAndGetString
        {/* {t('Components.LocalAndSessionStorage.LocalStorage1FE-Get')} */}
      </Button>

      <ResultElementBoundary
        role='status'
        data-qa={'utils.localStorage.get.result'}
      >
        {result}
      </ResultElementBoundary>

      <Button
        data-qa='utils.localAndSessionStorage1FE.sessionStorage.getSessionString.btn'
        onClick={() => getSessionResult('key1', 'sessionStringValue')}
      >
        sessionStorageSetAndGetString
        {/* {t('Components.LocalAndSessionStorage.SessionStorage1FE-GetString')} */}
      </Button>

      <Button
        data-qa='utils.localAndSessionStorage1FE.sessionStorage.getSessionBoolean.btn'
        onClick={() => getSessionResult('key3', true)}
      >
        sessionStorageSetAndGetBoolean
        {/* {t('Components.LocalAndSessionStorage.SessionStorage1FE-GetBoolean')} */}
      </Button>

      <ResultElementBoundary
        role='status'
        data-qa={'utils.sessionStorage.getSession.result'}
      >
        {sessionResult}
      </ResultElementBoundary>
    </div>
  );
};
