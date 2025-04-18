import { NextFunction, Request, Response } from 'express';
import hash from 'object-hash';

import { badgeMaker } from '../utils/make-badge';
import { dataForRenderingTemplate } from './data';
import { version } from '../../../package.json';
import { getCachedWidgetConfigs } from '../utils/widget-config';
import { readOneFEConfigs } from '../utils/one-fe-configs';

/*
TODO: [1FE consumption] BadgeMaker
*/

const SERVER_VERSION = version;
const SERVER_BUILD_NUMBER = process.env.SERVER_BUILD_NUMBER || '';
const SERVER_GIT_SHA = process.env.SERVER_GIT_SHA || '';
const SERVER_GIT_BRANCH = process.env.SERVER_GIT_BRANCH || '';

type TemplatizeCDNUrlArgs = {
  widgetId: string;
  widgetVersion: string;
  templateFilePath?: string;
};

export const templatizeCDNUrl = ({
  widgetId,
  widgetVersion,
  templateFilePath = 'js/1fe-bundle.js',
}: TemplatizeCDNUrlArgs): URL => {
  return new URL(
    `${readOneFEConfigs()?.dynamicConfigs.cdn.widgets.basePrefix}${widgetId}/${widgetVersion}/${templateFilePath}`,
  );
};

class VersionController {
  public static index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log('here ;)');
    try {
      const dataForRenderingTemplatePayload =
        await dataForRenderingTemplate(req);

      if (!dataForRenderingTemplatePayload) {
        res.sendStatus(500);
        return;
      }

      const { widgetConfigs, pluginConfigs, packages } =
        dataForRenderingTemplatePayload;

      res.send({
        environment: readOneFEConfigs()?.environment,
        version: SERVER_VERSION,
        nodeVersion: process.version,
        ...(!(readOneFEConfigs()?.mode === 'production')
          ? {
              buildNumber: SERVER_BUILD_NUMBER,
              branch: SERVER_GIT_BRANCH,
              gitSha: SERVER_GIT_SHA,
            }
          : {}),
        packages,
        configs: {
          // have to return singular widgetConfig and pluginConfig for backward compatibility
          widgetConfig: widgetConfigs,
          pluginConfig: pluginConfigs,
        },
        hashOfWidgetConfigs: hash.MD5({ ...widgetConfigs }),
      });
    } catch (error) {
      next(error);
    }
  };

  public static widgetVersion = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, error } = await validateWidgetInputs(req);

      if (!data) {
        res.status(400).send({ error });
        return;
      }

      res.send(data);
    } catch (error) {
      next(error);
    }
  };

  public static widgetBundle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { data, error } = await validateWidgetInputs(req);
      if (!data) {
        res.status(400).send({ error });
        return;
      }

      res.redirect(data.bundle.toString());
    } catch (error) {
      next(error);
    }
  };

  // // Following the convention as described here: https://shields.io/badges/endpoint-badge
  public static widgetBadge = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { version: requestedWidgetVersion } = req.params;
      if (requestedWidgetVersion !== 'current') {
        res.status(400).send({
          error: `Badge is not available for version '${requestedWidgetVersion}'. Use 'current' for current version`,
        });
        return;
      }
      const { data } = await validateWidgetInputs(req);

      if (data) {
        const { id: widgetId, version: widgetVersion } = data;
        const badgeSvg = badgeMaker(widgetId, widgetVersion);
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        res.send(badgeSvg);
      } else {
        const badgeSvg = badgeMaker('NA', 'NA');
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        res.send(badgeSvg);
      }
    } catch (error) {
      next(error);
    }
  };
}

type WidgetBuildValidationResult =
  | {
      data: {
        id: string;
        version: string;
        url: string;
        bundle: string;
        contract: string;
      };
      error: undefined;
    }
  | {
      data: undefined;
      error: string;
    };

/**
 * Validates the widgetId and version params and returns the {@link WidgetBuildValidationResult} result.
 *
 * Exported for unit testing
 */
export async function validateWidgetInputs(
  req: Request,
): Promise<WidgetBuildValidationResult> {
  const { org, widgetId, version } = req.params;

  if (!org) {
    return { data: undefined, error: `Missing org, example: '@1fe'` };
  }

  if (!widgetId) {
    return {
      data: undefined,
      error: `Missing widgetId, example: 'widget-starter-kit'`,
    };
  }

  if (!version) {
    return {
      data: undefined,
      error: `Missing version, use 'current' for current version`,
    };
  }

  const resolvedWidgetId = `${org}/${widgetId}`;
  const widgetConfigs = getCachedWidgetConfigs();

  const widget = widgetConfigs.get(resolvedWidgetId);

  if (!widget) {
    return {
      data: undefined,
      error: `Could not find widget '${resolvedWidgetId}'. Check if the widget is published.`,
    };
  }

  if (version !== 'current') {
    return {
      data: undefined,
      error: `API only supports 'current' version. Please use 'current' version or construct your own versioned cdn url`,
    };
  }

  const resolvedVersion = widget.version;
  const widgetCdnUrl = `${templatizeCDNUrl({
    widgetId: resolvedWidgetId,
    widgetVersion: resolvedVersion,
    templateFilePath: '',
  })}`;
  const widgetBundleUrl = `${widgetCdnUrl}js/1fe-bundle.js`;
  const widgetContractUrl = `${widgetCdnUrl}types/contract.rolledUp.d.ts`;

  return {
    data: {
      id: resolvedWidgetId,
      version: resolvedVersion,
      url: widgetCdnUrl,
      bundle: widgetBundleUrl,
      contract: widgetContractUrl,
    },
    error: undefined,
  };
}

export default VersionController;
