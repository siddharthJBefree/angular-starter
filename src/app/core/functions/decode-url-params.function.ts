export const decodeURLParams = (encodedParams: Record<string, string>): Record<string, string> => {
  const decodedParams: Record<string, string> = {};

  for (const [encodedKey, encodedValue] of Object.entries(encodedParams)) {
    decodedParams[atob(encodedKey)] = atob(encodedValue);
  }

  return decodedParams;
};
