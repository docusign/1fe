// import { platformProps } from '@1fe/shell';
import styled from '@emotion/styled';
import { Input, Button } from 'antd';
import { useState } from 'react';

// import { useTranslate } from 'src/locales';
export const Go = (props) => {
  // const t = useTranslate();
  const [delta, setDelta] = useState<string>('-1');

  const GoContainer = styled.div({
    display: 'flex',
    marginTop: '10px',
    alignItems: 'end',
  });

  const ButtonContainer = styled.div({
    height: '50%',
  });

  return (
    <GoContainer>
      <div>
        <Input
          placeholder={delta}
          // placeholder={t('Components.Navigation.GoInputText')}
          onChange={(e) => setDelta(e.target.value)}
          value={delta}
        />
      </div>
      <ButtonContainer>
        <Button
          data-qa="utils.navigation.go.btn"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore This new util will does not exist yet
            props.platform.utils.navigation.go(Number(delta));
          }}
        >
          {'utils.navigation.go'}
          {/* {t('Components.Navigation.GoText')} */}
        </Button>
      </ButtonContainer>
    </GoContainer>
  );
};
