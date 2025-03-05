type ParsedError = {
  type: string;
  message: string;
  file: string;
  widget: string;
  location: string;
  stack: string;
};

const errorTypeRE = /^(.*?):\s*/;

const getMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const getType = (error: Error | unknown): string => {
  if (error instanceof Error) {
    const stack = error.stack;
    if (stack) {
      const match = stack.match(errorTypeRE);
      if (match) {
        return match[1];
      }
    }
  }
  return 'Error';
};

const parseStack = (
  error: Error | unknown,
): { file: string; location: string; widget: string } => {
  if (error instanceof Error) {
    const stack = error.stack;
    if (stack) {
      const match = stack.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
      if (match) {
        const [, widget, file, line, column] = match;
        return {
          file: file.trim(),
          widget: widget.trim(),
          location: `${line.trim()}:${column.trim()}`,
        };
      }
      const match2 = stack.match(/at\s+()(.*):(\d+):(\d+)/);
      if (match2) {
        const [, widget, file, line, column] = match2;
        return {
          file: file.trim(),
          widget: widget.trim(),
          location: `${line.trim()}:${column.trim()}`,
        };
      }
    }
  }
  return {
    file: '',
    location: '',
    widget: '',
  };
};

export const parseError = (error: unknown): ParsedError => {
  const { file, location, widget } = parseStack(error);

  return {
    type: getType(error),
    message: getMessage(error),
    file: file,
    location: location,
    widget,
    stack: error instanceof Error ? error.stack ?? '' : '',
  };
};
