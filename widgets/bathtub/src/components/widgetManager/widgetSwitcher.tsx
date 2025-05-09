import { memo, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import { Modal, Typography, Button, Input } from 'antd';

import { Box, Column, Text } from '../../components/layout';
import { QuickLinks } from '../../components/widgetManager/quickLinks';
import {
  createShallowSelector,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { appActions, selectActiveWidgetUrl, selectApp } from '../../store/app';

type WidgetSwitcherProps = {
  trigger: React.ReactNode;
};

const widgetSwitcherStateSelector = createShallowSelector(
  selectApp,
  selectActiveWidgetUrl,
  (app, widgetUrl) => ({
    isVisible: app.isWidgetSwitcherOpen,
    widgetUrl,
  }),
);

const spacingM = '32px';
const spacingS = '24px';

const WidgetSwitcher = memo(({ trigger }: WidgetSwitcherProps) => {
  const { isVisible, widgetUrl } = useAppSelector(widgetSwitcherStateSelector);
  const dispatch = useAppDispatch();
  const [newUrl, updateUrl] = useState(widgetUrl);

  return (
    <>
      {trigger}

      <Modal
        open={isVisible}
        onCancel={() => dispatch(appActions.setIsWidgetSwitcherOpen(false))}
        footer={[
          <Hotkeys
            keyName='esc'
            onKeyDown={() => {
              dispatch(appActions.setIsWidgetSwitcherOpen(false));
            }}
          >
            <Button
              type='primary'
              disabled={!newUrl || newUrl === widgetUrl}
              onClick={() => {
                if (newUrl) dispatch(appActions.setActiveWidgetUrl(newUrl));
              }}
              data-qa='apply-widget-url'
            >
              Apply
            </Button>
          </Hotkeys>,
          <Button
            type='primary'
            onClick={() => {
              dispatch(appActions.setIsWidgetSwitcherOpen(false));
            }}
          >
            Close
          </Button>,
        ]}
      >
        <Typography.Title level={2}>Widget switcher</Typography.Title>
        <Column padding={`${spacingM} 0`}>
          {/* <WidgetSearch
              currentUrl={newUrl ?? widgetUrl}
              onChange={updateUrl}
            /> */}
          {/* <Box padding={`${spacingM} 0`}>
              <h5>OR</h5>
            </Box> */}
          {/* <label htmlFor='widgetUrl'>Enter a widget url</label>
          <input
            id='widgetUrl'
            name='widgetUrl'
            type='url'
            placeholder='http://localhost:8081/js/1fe-bundle.js'
            onChange={(e) => updateUrl(e.target.value)}
            value={newUrl ?? widgetUrl}
            data-qa='widgetUrlInput'
          /> */}

          <label htmlFor='widgetUrl'>Enter a widget url</label>
          <Input
            id='widgetUrl'
            name='widgetUrl'
            type='url'
            placeholder='http://127.0.0.1:8081/js/1fe-bundle.js'
            onChange={(e) => updateUrl(e.target.value)}
            value={newUrl ?? widgetUrl}
            data-qa='widgetUrlInput'
          />

          <div>
            <Text>Quick load: </Text>
            <QuickLinks port='8080' />
            <QuickLinks port='8081' />
            <QuickLinks port='8082' />
            <QuickLinks port='8083' />
          </div>
          <Box padding={`${spacingS} 0`}>
            <p>
              <b>Shortcuts</b>
            </p>
            <table>
              <tbody>
                <tr>
                  <td>Copy</td>
                  <td>CTRL+SHIFT+C</td>
                </tr>
                <tr>
                  <td>Open widget switcher</td>
                  <td>Ctrl+/</td>
                </tr>
                <tr>
                  <td>Open props editor</td>
                  <td>Ctrl+P</td>
                </tr>
                <tr>
                  <td>Reset</td>
                  <td>Ctrl+R</td>
                </tr>
                <tr>
                  <td>Clean (on error)</td>
                  <td>CMD+ESC</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Column>
      </Modal>
    </>
  );
});

export { WidgetSwitcher };
