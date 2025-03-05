import { getShellPlatformUtils } from '../../../../../utils/shell-platform-utils';
import { widgets } from '../system';

import { WidgetRenderStatusType } from './types';
import { PlatformPropsType, WidgetOptions } from '../../../../../types/platform-utils';
import { WidgetConfig } from '../../../../../types/widget-config';
import { readMagicBoxShellConfigs } from '../../../../../configs/shell-configs';
import { isOverrideElementActive } from '../../../../../init/import-map-ui';
import { isUrl } from './is-url';
import { getShellLogger } from '../../../../../utils/telemetry';

interface InjectedWidgetFrameProps<TWidgetProps> {
  /**
   * The scoped platform utils for the loaded widget or plugin
   */
  platform: PlatformPropsType;

  /**
   * Props forwaded to the widget or plugin by the developer
   */
  host: Omit<TWidgetProps, 'children'>;

  /**
   * The children of the widget or plugin
   */
  children?: React.ReactNode;
}

export async function downloadWidget<TWidgetProps>(
  widgetId: string | URL,
  setWidgetRenderStatus: React.Dispatch<
    React.SetStateAction<WidgetRenderStatusType>
  >,
  options: {
    widgetFrameId: string;
    requestedWidgetConfigOrUrl?: WidgetConfig | URL;
    hostProps: Omit<TWidgetProps, 'children'>;
    hostWidgetId: string;
    widgetOptions: WidgetOptions;
  },
): Promise<{
  default: React.FC<InjectedWidgetFrameProps<TWidgetProps>>;
}> {
  const {
    requestedWidgetConfigOrUrl,
    hostWidgetId,
    // hostProps,
    widgetOptions,
    widgetFrameId,
  } = options;

  const widgetsInstance = widgets({
    hostWidgetId,
    system: System,
  });

  const logger = getShellLogger();

  const isWidgetOverriden = isOverrideElementActive();
  const IS_PROD = readMagicBoxShellConfigs().mode === 'production';
  // const widgetLoadingStartTime = Date.now();
  const widgetLoadTime = getShellPlatformUtils().appLoadTime;

  const logDownloadWidgetError = (message: string, error: unknown) => {
    logger.error({
      message,
      parsedWidget: widgetId,
      error,
      widget: isUrl(widgetId)
        ? { widgetId: widgetId.toString(), version: '0.0.0' }
        : requestedWidgetConfigOrUrl,
      url: isUrl(widgetId) ? widgetId.toString() : undefined,
      isOverrideActive: isWidgetOverriden,
      widgetId: (widgetId as string) || widgetFrameId
    });
  }
    

  try {
    // corresponding end mark is in the widget code: props.platform.utils.appLoadTime.end()
    widgetLoadTime.markStart(widgetId.toString());

    // corresponding end mark is below: widgetLoadTime.markEnd(`${widgetId}-download`)
    widgetLoadTime.markStart(`${widgetId}-download`);

    const getModule = isUrl(widgetId)
      ? () => widgetsInstance.getByUrl(widgetId, widgetOptions)
      : () => widgetsInstance.get(widgetId, widgetOptions);

    let module: System.Module;
  

    module = await getModule();

    widgetLoadTime.markEnd(`${widgetId}-download`, {
      detail: {
        status: 'success',
      },
    });

    // FAQ: Where is the markEnd for `widgetLoadTime.mark(widgetId.toString())`?
    // The corresponding end mark is in the widget code: props.platform.utils.appLoadTime.end()

    logger.log({
      message: `[1DS-Shell] Widget loaded`,
      widget: isUrl(widgetId)
        ? { widgetId: widgetId.toString(), version: '0.0.0' }
        : requestedWidgetConfigOrUrl,
      url: isUrl(widgetId) ? widgetId.toString() : undefined,
      isOverrideActive: isWidgetOverriden,
      widgetId: (widgetId as string) || widgetFrameId
    });

    if (!isWidgetOverriden) {
      // Only log widget load time if the widget url is not being overridden
      // logger.logCounter(
      //   {
      //     measure: Date.now() - widgetLoadingStartTime,
      //     instance: serverBuildNumber
      //       ? `${environment}-${serverBuildNumber}-${widgetId}`
      //       : `${environment}-${widgetId}`,
      //     success: true,
      //   },
      //   widgetLoadCounterSource,
      // );
    }

    if (module.default == null || typeof module.default !== 'function') {
      throw new Error(`Widget ${widgetId} has no default export`);
    }

    // update frame loading status
    setWidgetRenderStatus('rendered');

    return module as {
      default: React.FC;
    };
  } catch (error) {
    widgetLoadTime.markEnd(`${widgetId}-download`, {
      detail: {
        status: 'failure',
      },
    });

    widgetLoadTime.markEnd(widgetId.toString(), {
      detail: { status: 'failure' },
    });

    logDownloadWidgetError(`[1DS-Shell] Widget download failed`, error);

    if (!isWidgetOverriden) {
      // Only log widget load time if the widget url is not being overridden
      // logger.logCounter(
      //   {
      //     measure: Date.now() - widgetLoadingStartTime,
      //     instance: serverBuildNumber
      //       ? `${environment}-${serverBuildNumber}-${widgetId}`
      //       : `${environment}-${widgetId}`,
      //     success: false,
      //   },
      //   widgetLoadCounterSource,
      // );
    }

    // update frame loading status
    setWidgetRenderStatus('error');
    // Remember to throw the error so that the error boundary can catch it
    let errorMessage = `Failed to load widget: ${widgetId}`;
    // Adding stack trace only in non-production environment to help in debugging
    if (!IS_PROD) {
      if (error instanceof Error) {
        errorMessage += ` ErrorMessage: ${error.message}, ErrorStack: ${error.stack}`;
      } else {
        errorMessage += ` ErrorMessage: ${String(error)}`;
      }
    }
    throw new Error(errorMessage);
  }
}
