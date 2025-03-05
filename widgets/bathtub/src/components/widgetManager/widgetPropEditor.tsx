import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { memo, useEffect, useRef } from 'react';
import Hotkeys from 'react-hot-keys';
import { Button, Typography, Flex, Modal } from 'antd';
import styled from '@emotion/styled';

import { useTranslate } from '../../locales';
import {
  createShallowSelector,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { appActions, selectActiveWidgetProps, selectApp } from '../../store/app';

type WidgetPropEditorProps = {
  trigger: React.ReactNode;
};

const widgetPropEditorStateSelector = createShallowSelector(
  selectApp,
  selectActiveWidgetProps,
  (app, activeWidgetProps) => ({
    isVisible: app.isPropsEditorOpen,
    widgetProps: activeWidgetProps,
    hasPropsError: app.hasPropsError,
  }),
);

const WidgetPropEditor = memo(({ trigger }: WidgetPropEditorProps) => {
  const t = useTranslate();
  const { isVisible, widgetProps, hasPropsError } = useAppSelector(
    widgetPropEditorStateSelector,
  );
  const draft = useRef<string>(widgetProps);
  const dispatch = useAppDispatch();

  // temporarily replacing banner
  useEffect(() => {
    if (hasPropsError) {
      window.alert(t('Bathtub.PropEditor.ValidationError'));
      dispatch(appActions.clearPropsError());
    }
  }, [hasPropsError]);

  return (
    <>
      {trigger}
      <Modal
        open={isVisible}
        onCancel={() => dispatch(appActions.setIsPropsEditorOpen(false))}
        footer={[
          <Hotkeys
          keyName='esc'
          onKeyDown={() => {
            dispatch(appActions.setIsPropsEditorOpen(false));
            dispatch(appActions.clearPropsError());
          }}
        >
            <Button
            type="primary"
            onClick={() => {
              if (draft.current && draft.current !== widgetProps) {
                dispatch(appActions.setActiveWidgetProps(draft.current));
              }
            }}
            data-qa='props-editor-update'
            >
              {t('Bathtub.PropEditor.Update')}
            </Button>
            <Button
              type="primary"
              onClick={() => dispatch(appActions.setIsPropsEditorOpen(false))}
              >
              Close
            </Button>
        </Hotkeys>
        ]}
      >
        <Typography.Title level={2}>Widget props</Typography.Title>
        <CodeMirror
          theme='dark'
          value={widgetProps}
          width='100%'
          height='50vh'
          extensions={[javascript({ jsx: true })]}
          onChange={(newProps) => {
            draft.current = newProps;
          }}
        />
      </Modal>
    </>
  );
});

export { WidgetPropEditor };
