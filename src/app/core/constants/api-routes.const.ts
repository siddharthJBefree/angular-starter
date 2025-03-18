const createURL = <T extends Record<string, string>, U extends boolean = true>(url: string, extraProps?: T, withDefaultVariant?: U) => {
  const defaultVariant = ['list', 'create', 'read', 'update', 'update-status', 'delete', 'delete-all'] as const;

  type DefaultRoutes = U extends true ? Record<(typeof defaultVariant)[number], string> : object;

  // Construct the default routes if enabled
  const routes = (
    withDefaultVariant !== false
      ? defaultVariant.reduce(
          (acc, item) => {
            acc[item] = `${url}/${item}`;
            return acc;
          },
          {} as Record<(typeof defaultVariant)[number], string>
        )
      : {}
  ) as DefaultRoutes;

  const formattedExtraProps = extraProps
    ? (Object.fromEntries(Object.entries(extraProps).map(([key, value]) => [key, `${url}/${value}`])) as T)
    : ({} as T);

  // Merge and return
  return {...routes, ...formattedExtraProps} as DefaultRoutes & T;
};

export const API_ROUTES = Object.freeze({
  auth: createURL(
    'auth',
    {
      checkIpAddress: 'check-ip-address',
      login: 'login',
      signup: 'signup',
      forgotPassword: 'forgot-password',
      resetPassword: 'reset-password'
    },
    false
  )
});
