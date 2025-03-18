import {E_PORTAL_VARIANT} from '../../app/core/enums/portal-variant.enum';

export interface IEnvironment {
  // Currently which Environment is running
  platform: 'PRODUCTION' | 'QA' | 'DEV';

  // Whether Portal Will load based on path or url
  isPathPortalVariant: boolean;

  // Set if PWA Should be added or not
  pwa: boolean;

  /**
   * Used in Crypto-js to encrypt things
   * Note: Whenever we change ENCRYPTION_TOKEN console will throw error
   * Error :- "Malformed UTF-8" data so clear cache and reload the website
   *
   * @type {string}
   * @memberof IEnvironment
   */
  encryptionToken: Record<E_PORTAL_VARIANT, string>;

  // Server Environment
  serverUrl: Record<E_PORTAL_VARIANT, string>;
  clientUrl: Record<E_PORTAL_VARIANT, string>;
  resourceUrl: Record<E_PORTAL_VARIANT, string>;
}
