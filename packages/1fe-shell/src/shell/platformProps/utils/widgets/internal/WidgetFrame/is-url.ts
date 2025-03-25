export function isUrl(widgetRequest: string | URL): widgetRequest is URL {
  return widgetRequest instanceof URL;
}
