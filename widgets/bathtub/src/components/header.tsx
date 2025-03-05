import styled from '@emotion/styled';
import { memo, useEffect } from 'react';
import Hotkeys from 'react-hot-keys';
import { Button } from 'antd';

import { useTranslate } from '../locales';
import { useAppDispatch, useAppSelector } from '../store';
import { appActions, selectWidget } from '../store/app';

import { WidgetSwitcher } from '../components/widgetManager/widgetSwitcher';
import { Box, Row } from './layout';
import { WidgetPropEditor } from './widgetManager';

const HeaderWrapper = styled(Box)`
  // box-shadow: 0px 2px 8px rgba(25, 24, 35, 0.15);
  grid-area: header;
`;

const AppHeader = memo(() => {
  const dispatch = useAppDispatch();
  const widget = useAppSelector(selectWidget);
  // const variants = useAppSelector(widgetBrowserSelectors.selectVariants);
  const t = useTranslate();

  useEffect(() => {
    document.title = widget?.widgetId ?? '@1fe/bathtub';
  }, [widget]);

  // const onVariantChange: SelectOnChangeHandler = useCallback(
  //   (event) => {
  //     dispatch(widgetBrowserActions.pickVariant(event.target.value));
  //   },
  //   [dispatch],
  // );

  return (
    <HeaderWrapper>
      {/* <Header
        fullWidth
        skipNavTarget='/bathtub#main'
        skipNavText={t('Bathtub.Header.SkipLink')}
      > */}
      {/* <Header.Start> */}
      {/* <Row
        css={{
          gap: '16px',
          'justifyContent': 'flex-start',
          align: 'center'
        }}> */}

      <Row
        css={{
          gap: '16px',
          justifyContent: 'flex-end',
          align: 'center',
        }}
      >
        <Hotkeys
          keyName="cmd+shift+c"
          onKeyDown={() => {
            if (widget) {
              navigator.clipboard.writeText(
                `https://apps.dev.docusign.net/bathtub/?widget=${widget.widgetId}`,
              );
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <Hotkeys
            keyName="cmd+/"
            onKeyDown={() => {
              dispatch(appActions.setIsWidgetSwitcherOpen(true));
            }}
          >
            <WidgetSwitcher
              trigger={
                <Button
                  type="primary"
                  data-qa="widget-switcher-launch-button"
                  // startElement={
                  //   <span>
                  //     {widget
                  //       ? `${widget.widgetId} v.${
                  //           widget.lastModified.integration?.widgetVersion ??
                  //           'unknown'
                  //         }`
                  //       : '@1fe/bathtub'}
                  //   </span>
                  // }
                  onClick={() => {
                    dispatch(appActions.setIsWidgetSwitcherOpen(true));
                  }}
                >
                  {t('Bathtub.Header.Waffle')}
                </Button>
              }
            />
          </Hotkeys>
        </Hotkeys>

        <Hotkeys
          keyName="cmd+p"
          onKeyDown={(_, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            dispatch(appActions.setIsPropsEditorOpen(true));
          }}
        >
          <WidgetPropEditor
            trigger={
              <Button
                type="primary"
                data-qa="widget-prop-editor-button"
                onClick={() => {
                  dispatch(appActions.setIsPropsEditorOpen(true));
                }}
              >
                {t('Bathtub.Header.Editor')}
              </Button>
            }
          />
        </Hotkeys>
        {/* {variants?.length ? (
              <Select
                label={t('Bathtub.Header.Variant')}
                onChange={onVariantChange}
                data-qa='widget-variant-select'
              >
                <Select.Option
                  text={t('Bathtub.Header.VariantDefault')}
                  value={DEFAULT_VARIANT}
                />
                {variants.map((variant) => (
                  <Select.Option text={variant} key={variant} value={variant} />
                ))}
              </Select>
            ) : null} */}
        <Button
          type="primary"
          onClick={() => {
            dispatch(appActions.reset());
          }}
        >
          {t('Bathtub.Header.Reset')}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            dispatch(appActions.renderWidget());
          }}
        >
          {t('Bathtub.Header.Render')}
        </Button>
      </Row>
    </HeaderWrapper>
  );
});

export { AppHeader };
