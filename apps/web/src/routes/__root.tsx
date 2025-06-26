import { Content } from '@/components/layout/content/Content';
import { Login } from '@/components/login/Login';
import { useAuth } from '@/context/auth-context';
import type { RouterContext } from '@/lib/router';
import { createRootRouteWithContext, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <AuthGuard />,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search, location }) => {
    if (context.auth.isAuthenticated) {
      if (search.redirect) throw redirect({ to: search.redirect });
    } else if (location.pathname !== '/') {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }
  },
});

const AuthGuard = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Login />;
  }

  return <Content />;
};
