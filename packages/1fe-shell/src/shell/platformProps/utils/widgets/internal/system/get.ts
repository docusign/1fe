import 'react';

import { logPlatformUtilUsage } from '../../../logPlatformUtilUsage';
import { getWidgetPath } from '../../../../context/getWidgetPath';
import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../../1fe-server/src/server/utils/widget-config-helpers';
import { getComponentFromModule as _getComponentFromModule } from '../utils/getComponentFromModule';
import { getDefaultWidgetOptions } from '../utils/constants';
import { WidgetOptions } from '../../../../../types/platform-utils';
import { isSystemEnv } from '../utils/isSystem';
import { WIDGET_CONFIGS } from '../../../../../configs/config-helpers';
import { isWidgetTypePinned } from '../../../../../utils/widget-type';
import { getWidgetBundleCdnUrl } from '../../../../../utils/url';
import { getShellLogger } from '../../../../../utils/telemetry';
import { isOverrideElementActive } from '../../../../../init/import-map-ui';

/**
 *
 * @param _System SystemJS reference
 * @param hostWidgetId widgetId of the widget calling widgets.get()
 * @returns the requested widget, fetched from the cdn
 */
export const get =
  (_System: typeof System, hostWidgetId: string) =>
  async (
    requestedWidgetId: string,
    {
      variantId = getDefaultWidgetOptions().variantId,
    }: WidgetOptions = getDefaultWidgetOptions(), // NOTE: always deconstruct here to individually initialize options
  ): Promise<System.Module> => {
    const logger = getShellLogger();

    const options = { variantId };

    const widgetLogInfo = {
      hostWidget: {
        widgetId: hostWidgetId,
      },
      requestedWidget: {
        widgetId: requestedWidgetId,
        widgetPath: getWidgetPath(requestedWidgetId),
      },
    };

    const getComponentFromModule = async (widgetId: string) =>
      _getComponentFromModule({
        options,
        module: await _System.import(widgetId),
        log(message: string, otherData: Record<string, unknown> = {}) {
          logger.log({
            ...otherData,
            message,
            category: 'utils.widgets.get',
            widgetId: requestedWidgetId,
            isOverrideActive: isOverrideElementActive(),
            ...widgetLogInfo,
          });
        },
      });

    if (!requestedWidgetId) {
      const errorMessage =
        '[platformProps.utils.widgets.get] No widget ID provided, please refer to API documentation: https://github.docusignhq.com/pages/Core/1ds-docs/widgets/utils/widgets/#get';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!isSystemEnv()) {
      const errorMessage =
        '[platformProps.utils.widgets.get] Systemjs not detected. Something is critically wrong. Please reach out to 1DS team.';

      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const { requestedWidgetConfig, type } =
        getRequestedWidgetConfigWithoutRuntimeConfig({
          hostWidgetId,
          requestedWidgetId,
          widgetConfigs: WIDGET_CONFIGS
        });

      const isPinnedWidget = isWidgetTypePinned(type);

      logPlatformUtilUsage({
        utilNamespace: 'widgets',
        functionName: 'get',
        widgetId: hostWidgetId,
        args: { requestedWidgetId, isPinnedWidget, options },
        attributes: { isSystemEnv },
      });

      const importMapOverrides =
        window.importMapOverrides?.getOverrideMap() || {};

      const doesPinnedWidgetOverrideExist =
        !!importMapOverrides.imports?.[requestedWidgetId];

      if (
        !!requestedWidgetConfig &&
        isPinnedWidget &&
        !doesPinnedWidgetOverrideExist
      ) {
        const requestedPinnedWidgetConfigBundleCdnUrl = getWidgetBundleCdnUrl({
          widgetId: requestedWidgetId,
          version: requestedWidgetConfig.version,
        });

        return getComponentFromModule(requestedPinnedWidgetConfigBundleCdnUrl);
      }

      return getComponentFromModule(requestedWidgetId);
    } catch (error) {
      const message = `[platformProps.utils.widgets.get] Getting widget by ID failed.`;

      console.error(message, error, widgetLogInfo);

      logger.error({
        error,
        message,
        ...widgetLogInfo,
        category: 'utils.widgets.get',
        isOverrideActive: isOverrideElementActive(),
        widgetId: requestedWidgetId,
      });

      throw new Error(message);
    }
  };
