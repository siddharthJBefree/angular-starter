export enum E_ACCESS_TYPE {
  LIST = 'list',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  UPDATE_STATUS = 'update-status',
  DELETE = 'delete',
  DELETE_ALL = 'delete-all',
  EXTRA_ACTION = 'extra_action',
  FIELD_RIGHT = 'field_right',
  AUTO_ALLOWED_ACTION = 'auto_allowed_action',
  SUPER_ADMIN = 'super-admin'
}
export enum E_EXTRA_ACTION {}
export enum E_AUTO_ALLOWED_ACTION {}
export enum E_FIELD_ACCESS_TYPE {
  CREATE = 'create',
  VIEW = 'view',
  UPDATE = 'edit'
}

export type T_ACCESS_TYPE = Exclude<keyof typeof E_ACCESS_TYPE, 'EXTRA_ACTION' | 'FIELD_RIGHT' | 'AUTO_ALLOWED_ACTION' | 'SUPER_ADMIN'>;
export type T_EXTRA_ACTION = keyof typeof E_EXTRA_ACTION;
export type T_AUTO_ALLOWED_ACTION = keyof typeof E_AUTO_ALLOWED_ACTION;
export type T_FIELD_ACCESS_TYPE = keyof typeof E_FIELD_ACCESS_TYPE;
