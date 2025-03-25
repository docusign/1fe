export const REDACTED = 'REDACTED';

/**
 * Redact the jwt token(s) in the value
 * @param value - this may contain jwt token(s)
 */
export const redactSensitiveData = (value: string): string => {
  try {
    // Redact emails
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const dataWithoutEmails = value.replace(emailRegex, REDACTED);

    // Redact JWTs
    const redactedValue = dataWithoutEmails.replace(
      /eyJ[\w-]+(?:\.[\w-]+){2}/g,
      REDACTED,
    );

    // Replace the 'state' parameter with 'state=REDACTED' (encoded or decoded)
    const redactedState = redactedValue.replace(
      /state=%7B[^&]+%7D|state=([^&]+)/,
      'state=REDACTED',
    );

    return redactedState;
  } catch {
    return value;
  }
};
