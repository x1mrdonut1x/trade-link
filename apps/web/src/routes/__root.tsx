import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';

import z from 'zod';
import type { RouterContext } from '../lib/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootRoute />,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search, location }) => {
    if (context.auth.isAuthenticated) {
      if (search.redirect) throw redirect({ to: search.redirect, search: {} });

      if (context.auth.user?.membership?.length && location.pathname === '/') {
        throw redirect({
          to: '/$tenantId',
          params: { tenantId: context.auth.user.membership[0].id.toString() },
        });
      }
    } else if (!context.auth.user?.membership?.length && location.pathname !== '/' && !search.redirect) {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }
  },
});

const RootRoute = () => {
  return <Outlet />;
};
