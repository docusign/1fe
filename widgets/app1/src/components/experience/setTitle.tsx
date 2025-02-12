// import { platformProps } from '@1ds/shell';
import styled from '@emotion/styled';
import { Button, Input } from 'antd';
import { useState } from 'react';

// import { useTranslate } from 'src/locales';

const NavigateWithTextboxContainer = styled.div({
  display: 'flex',
  marginTop: '10px',
});

export const SetTitle = (props) => {
  // const t = useTranslate();
  const [title, setTitle] = useState<string>('hello world');

  return (
    <NavigateWithTextboxContainer>
      <Input
        // placeholder={t('Components.Experience.SetTitle-PlaceholderText')}
        data-qa='utils.experience.set-title.normal.input'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <Button
        data-qa='utils.experience.title.set'
        onClick={() => props.platform.utils.experience.title.set(title)}
      >
        utils.experience.title.set
        {/* {t('Components.Experience.SetTitle')} */}
      </Button>
    </NavigateWithTextboxContainer>
  );
};
