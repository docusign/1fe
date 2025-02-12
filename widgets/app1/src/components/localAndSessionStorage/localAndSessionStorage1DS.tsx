// import { platformProps } from '@1ds/shell';
import { Button } from 'antd';
import { useState } from 'react';

import ResultElementBoundary from '../misc/resultElementBoundary';
// import { useTranslate } from 'src/locales';

export const LocalAndSessionStorage1DS = (props) => {
  type allowedTypes = string | boolean | number;
  // const t = useTranslate();

  const [result, setResult] = useState<allowedTypes>('');
  const [sessionResult, setSessionResult] = useState<allowedTypes>();
  const getResult = (key: string, value: allowedTypes) => {
    props.platform.utils.localStorage.set(key, value);
    setResult(props.platform.utils.localStorage.get(key).toString());
  };
  const getSessionResult = (key: string, value: allowedTypes) => {
    props.platform.utils.sessionStorage.set(key, value);
    setSessionResult(props.platform.utils.sessionStorage.get(key).toString());
  };

  return (
    <div data-qa='utils.localAndSessionStorage1DS.container'>
      <Button
        data-qa='utils.localAndSessionStorage1DS.localStorage.getBoolean.btn'
        onClick={() => getResult('key2', true)}
      >
        localStorageSetAndGetBoolean
        {/* {t('Components.LocalAndSessionStorage.LocalStorage1DS-GetBoolean')} */}
      </Button>
      <Button
        data-qa='utils.localAndSessionStorage1DS.localStorage.get.btn'
        onClick={() => getResult('key1', 'value1')}
      >
        localStorageSetAndGetString
        {/* {t('Components.LocalAndSessionStorage.LocalStorage1DS-Get')} */}
      </Button>

      <ResultElementBoundary
        role='status'
        data-qa={'utils.localStorage.get.result'}
      >
        {result}
      </ResultElementBoundary>

      <Button
        data-qa='utils.localAndSessionStorage1DS.sessionStorage.getSessionString.btn'
        onClick={() => getSessionResult('key1', 'sessionStringValue')}
      >
        sessionStorageSetAndGetString
        {/* {t('Components.LocalAndSessionStorage.SessionStorage1DS-GetString')} */}
      </Button>

      <Button
        data-qa='utils.localAndSessionStorage1DS.sessionStorage.getSessionBoolean.btn'
        onClick={() => getSessionResult('key3', true)}
      >
        sessionStorageSetAndGetBoolean
        {/* {t('Components.LocalAndSessionStorage.SessionStorage1DS-GetBoolean')} */}
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
