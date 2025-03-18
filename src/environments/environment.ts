import {E_PORTAL_VARIANT} from '../app/core/enums/portal-variant.enum';
import {IEnvironment} from './interface/environment.interface';

export const environment: IEnvironment = {
  platform: 'PRODUCTION',
  isPathPortalVariant: false,
  pwa: false,

  // Encryption Token
  encryptionToken: {
    [E_PORTAL_VARIANT.portal_1]: '',
    [E_PORTAL_VARIANT.portal_2]: ''
  },

  // Server Environment
  serverUrl: {
    [E_PORTAL_VARIANT.portal_1]: '',
    [E_PORTAL_VARIANT.portal_2]: ''
  },
  clientUrl: {
    [E_PORTAL_VARIANT.portal_1]: '',
    [E_PORTAL_VARIANT.portal_2]: ''
  },
  resourceUrl: {
    [E_PORTAL_VARIANT.portal_1]: '',
    [E_PORTAL_VARIANT.portal_2]: ''
  }
};
