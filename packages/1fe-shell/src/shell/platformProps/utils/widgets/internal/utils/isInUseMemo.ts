import { getBrowserEnvironment } from '../../../../../utils/env.helpers';

/**
 * Checks the execution stack to determine if the current function is being called from a useMemo.
 * If the feature flag is disabled, this function will always return true.
 */
export function isInUseMemo(): boolean {
  const error = new Error();
  const stack = error.stack;

  if (!stack) {
    console.log(
      '[ImplicitWidgetMemoization] Error stack is not available, assuming that we are in use memo',
    );
    return true; // If we can't get the stack, assume that we are in use memo
  }

  const isInUseMemo = /useMemo/.test(stack);

  // isInUseMemo is false in Safari browser, so we need to check it manually
  if (!isInUseMemo) {
    // hack only for Safari browser
    // Safari is a snowflake
    if (
      getBrowserEnvironment()?.browser?.name?.toLowerCase?.() === 'safari' &&
      typeof stack === 'string'
    ) {
      // In Safari, the stack trace minifies the useMemo if called conditionally in the error object
      // so we need to know the minified name of the useMemo function
      // ref: https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1433-L1442
      const stackArray = stack.split('\n');
      const isInUseMemoSafari = stackArray.some(
        (line) =>
          line.includes('wh') &&
          line.includes(
            'https://docucdn-a.akamaihd.net/production/1fe/libs/react-dom/17.0.2/umd/react-dom.production.min.js:109:151',
          ),
      );

      return isInUseMemoSafari;
    }
  }

  return isInUseMemo;
}
