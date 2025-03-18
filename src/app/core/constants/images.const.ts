import {E_PORTAL_VARIANT} from '../enums/portal-variant.enum';

export const LogoImage: Record<E_PORTAL_VARIANT, string> = Object.freeze({
  [E_PORTAL_VARIANT.portal_1]: 'logo.png',
  [E_PORTAL_VARIANT.portal_2]: 'logo.svg'
});

export const LogoSmallImage: Record<E_PORTAL_VARIANT, string> = Object.freeze({
  [E_PORTAL_VARIANT.portal_1]: 'logo-sm.png',
  [E_PORTAL_VARIANT.portal_2]: 'logo-sm.svg'
});

export const FaviconImage: Record<E_PORTAL_VARIANT, string> = Object.freeze({
  [E_PORTAL_VARIANT.portal_1]: 'logo-favicon.png',
  [E_PORTAL_VARIANT.portal_2]: 'logo-favicon.png'
});

export const LoginBgImage: Record<E_PORTAL_VARIANT, string> = Object.freeze({
  [E_PORTAL_VARIANT.portal_1]: 'login-bg.jpg',
  [E_PORTAL_VARIANT.portal_2]: 'login-bg.jpg'
});
