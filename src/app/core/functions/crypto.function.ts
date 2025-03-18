import {AES, enc} from 'crypto-js';
import {environment} from '../../../environments/environment';
import {GetPortalVariant} from './get-portal-variant.function';

const ENCRYPTION_TOKEN = environment.encryptionToken;

/**
 * Encrypts the given value using the ENCRYPTION_TOKEN set in the environment.
 * The value is first converted to a string if it is not already a string.
 * @param value The value to encrypt.
 * @returns The encrypted value as a string.
 */
export const Encrypt = (value: string): string => {
  return AES.encrypt(`${value}`, ENCRYPTION_TOKEN[GetPortalVariant()]).toString();
};

/**
 * Decrypts the given value using the ENCRYPTION_TOKEN set in the environment.
 * If the value is empty, an empty string is returned.
 * If there is an error decrypting the value, an empty string is returned and the error is logged to the console.
 * @param value The value to decrypt.
 * @returns The decrypted value or an empty string if there is an error.
 */
export const Decrypt = (value: string): string => {
  if (!value) {
    return '';
  }
  try {
    const bytes = AES.decrypt(value, ENCRYPTION_TOKEN[GetPortalVariant()]);
    return bytes.toString(enc.Utf8);
  } catch (error) {
    console.error(error);
    return '';
  }
};

/**
 * Encodes a string to base64.
 *
 * @param {string} value The value to encode.
 *
 * @returns {string} The base64 encoded string.
 */
export const EncryptBase64 = (value: string): string => {
  return btoa(`${value}`);
};

/**
 * Decodes a base64 string.
 *
 * @param {string} value The value to decode.
 *
 * @returns {string} The decoded string.
 */
export const DecryptBase64 = (value: string): string => {
  return atob(`${value}`);
};
