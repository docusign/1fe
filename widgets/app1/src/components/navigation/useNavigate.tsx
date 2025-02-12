// import { platformProps } from '@1ds/shell';
import styled from '@emotion/styled';
import { Input, Button } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { useTranslate } from 'src/locales';

const NavigateWithTextboxContainer = styled.div({
  display: 'flex',
  marginTop: '10px',
});

export const UseNavigate = (props) => {
  const [widgetUrl, setWidgetUrl] = useState<string>('/');
  const [pluginUrl, setPluginUrl] = useState<string>('/app2');
  // const t = useTranslate();
  const navigate = useNavigate();

  const navigate1ds = props.platform?.utils?.navigation?.useNavigate(
    navigate,
    useNavigate,
    useLocation,
  );

  const widgetNavigation = (
    <NavigateWithTextboxContainer>
      <Input
        value={widgetUrl}
        onChange={(e) => setWidgetUrl(e.target.value)}
        data-qa='utils.navigation.useNavigate.normal.input'
      />

      <Button
        size='large'
        data-qa='utils.context.get.btn'
        onClick={() => navigate1ds(widgetUrl)}
      >
        {'navigate within widget and update url'}
        {/* {t('Components.Navigation.Navigation1DS-Normal')} */}
      </Button>
      <Button
        size='large'
        data-qa='utils.navigation.useNavigate.normal.state.btn'
        onClick={() => navigate1ds(widgetUrl, { state: 'home' })}
      >
        {'navigate within widget and update url (with state)'}
        {/* {t('Components.Navigation.Navigation1DS-Normal-WithState')} */}
      </Button>
      <Button
        size='large'
        data-qa='utils.navigation.useNavigate.noURL.btn'
        onClick={() => navigate(widgetUrl)}
      >
        {'navigate within widget and don\'t update url'}
        {/* {t('Components.Navigation.Navigation1DS-NoURL')} */}
      </Button>
    </NavigateWithTextboxContainer>
  );

  const pluginNavigation = (
    <NavigateWithTextboxContainer>
      <Input
        value={pluginUrl}
        onChange={(e) => setPluginUrl(e.target.value)}
        data-qa='utils.navigation.useNavigate.p2p.input'
      />

      <Button
        size='large'
        data-qa='utils.navigation.useNavigate.p2p.btn'
        onClick={() =>
          navigate1ds(pluginUrl, {
            pluginToPluginNavigation: true,
          })
        }
      >
        {'navigate between plugins'}
        {/* {t('Components.Navigation.Navigation1DS-P2P-ButtonText')} */}
      </Button>
    </NavigateWithTextboxContainer>
  );

  return (
    <div data-qa='utils.navigation.useNavigate.container'>
      {/* <h3>{t('Components.Navigation.UseNavigate-new')}</h3> */}
      {widgetNavigation}
      {pluginNavigation}
    </div>
  );
};
