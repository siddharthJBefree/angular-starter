import {environment} from '../../../environments/environment';
import {E_PORTAL_VARIANT, T_PORTAL_VARIANT} from '../enums/portal-variant.enum';

const GetVariantFromPath = (): E_PORTAL_VARIANT | null => {
  if (environment.isPathPortalVariant) {
    const pathData = window.location.pathname.split('/').filter(Boolean)[0];
    return Object.values(E_PORTAL_VARIANT).includes(pathData as E_PORTAL_VARIANT) ? (pathData as E_PORTAL_VARIANT) : null;
  }
  return null;
};

const GetVariantFromClientUrl = (): E_PORTAL_VARIANT | null => {
  const result = Object.entries(environment.clientUrl).find(([, value]) => value === window.location.origin);
  return result ? (result[0] as E_PORTAL_VARIANT) : null;
};

const GetDefaultVariant = (): E_PORTAL_VARIANT => {
  return Object.values(E_PORTAL_VARIANT)[0] as E_PORTAL_VARIANT;
};

export const GetPortalVariant = (config?: {recheck: boolean}): T_PORTAL_VARIANT => {
  let variant = sessionStorage.getItem('CURRENT_PORTAL_VARIANT') as E_PORTAL_VARIANT;

  if (!variant || config?.recheck) {
    variant = (environment.isPathPortalVariant ? GetVariantFromPath() : GetVariantFromClientUrl()) || GetDefaultVariant();
  }

  return variant;
};
