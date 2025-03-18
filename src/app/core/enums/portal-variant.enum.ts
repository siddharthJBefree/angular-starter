export enum E_PORTAL_VARIANT {
  portal_1 = 'portal_1',
  portal_2 = 'portal_2'
}

export type T_PORTAL_VARIANT = keyof typeof E_PORTAL_VARIANT;

export const PortalList: Record<keyof typeof E_PORTAL_VARIANT, keyof typeof E_PORTAL_VARIANT> = Object.freeze({...E_PORTAL_VARIANT});
