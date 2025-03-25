import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

import { getShellLogger } from '../../../utils/telemetry';

const onedsTitleId = 'oneds-title';

const set =
  (widgetId: string) =>
  (title: string): void => {
    const logger = getShellLogger();

    const currentTitle = document.getElementById(onedsTitleId);
    const previousTitle = currentTitle?.innerText;
    if (currentTitle) {
      currentTitle.innerText = title;
    } else {
      logger.error({
        message: `Could not set title. DOM element '${onedsTitleId}' not found.`,
        category: 'utils.experience.title.set',
        widgetId,
        metaData: {
          arguments: {
            title,
          },
        },
      });
    }

    logPlatformUtilUsage({
      widgetId,
      utilNamespace: 'experience',
      functionName: 'title.set',
      args: { title },
      attributes: { previousTitle },
    });
  };

const get = (widgetId: string) => (): string | undefined => {
  const currentTitle = document.getElementById(onedsTitleId)?.innerText;

  logPlatformUtilUsage({
    widgetId,
    utilNamespace: 'experience',
    functionName: 'title.get',
    attributes: { currentTitle: currentTitle },
  });

  return currentTitle;
};

export const title = (widgetId: string) => ({
  set: set(widgetId),
  get: get(widgetId),
});
