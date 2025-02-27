// Extend expect with DOM expectations
import '@testing-library/jest-dom';

/**
 * All shell globals are in this file because we needed to mock PromiseRejectionEvent
 * with code and it was conflicting with globals in the jest config.
 */

type PromiseRejectionEventTypes = 'rejectionhandled' | 'unhandledrejection';

type PromiseRejectionEventInit = {
  promise: Promise<any>;
  reason: any;
};

class PromiseRejectionEvent extends Event {
  public readonly promise: Promise<any>;
  public readonly reason: any;

  public constructor(
    type: PromiseRejectionEventTypes,
    options: PromiseRejectionEventInit,
  ) {
    super(type);

    this.promise = options.promise;
    this.reason = options.reason;
  }
}

/**
 * Why?
 * https://github.com/jsdom/jsdom/issues/2401
 */
// @ts-expect-error - PromiseRejectionEvent is missing from jsdom and needs to be mocked, but exists in the vscode TS server
window.PromiseRejectionEvent = PromiseRejectionEvent;

// @ts-expect-error - mocking SystemJS
window.System = {
  set: () => {},
};

// @ts-expect-error - webpack define plugin var
window.__SHOW_DEVTOOL__ = false;
// @ts-expect-error - webpack define plugin var
window.__ENABLE_SERVICE_WORKER__ = true;

AbortSignal.prototype.throwIfAborted = function () {
  if (this.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError');
  }
};

export {};
