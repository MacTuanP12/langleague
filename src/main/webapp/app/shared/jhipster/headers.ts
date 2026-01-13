export type HeaderMessage = {
  /** Success message */
  alert?: string;
  /** Error message */
  error?: string;
  /** Entity id for success messages. Entity name for error messages. */
  param?: string;
};

const decodeHeaderValue = (headerValue: string): string => decodeURIComponent(headerValue.replace(/\+/g, ' '));

const headerToString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
};

export const getMessageFromHeaders = (headers: Record<string, unknown>): HeaderMessage => {
  let alert: string | undefined = undefined;
  let param: string | undefined = undefined;
  let error: string | undefined = undefined;
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase().endsWith('-alert')) {
      alert = headerToString(value);
    } else if (key.toLowerCase().endsWith('-error')) {
      error = headerToString(value);
    } else if (key.toLowerCase().endsWith('-params')) {
      const paramValue = headerToString(value);
      param = paramValue ? decodeHeaderValue(paramValue) : undefined;
    }
  }
  return { alert, error, param };
};
