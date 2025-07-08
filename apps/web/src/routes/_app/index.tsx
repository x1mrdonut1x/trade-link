import { createFileRoute, Outlet, useMatchRoute, useNavigate } from '@tanstack/react-router';

import { Login } from 'components/login/Login';
import { TenantSelector } from 'components/tenant/TenantSelector';
import { useAuth } from 'context';
import { useLayoutEffect } from 'react';

export const Route = createFileRoute('/_app/')({
  component: () => <AuthGuard />,
});

const AuthGuard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/' });

  useLayoutEffect(() => {
    if (auth.user?.membership?.length) {
      if (params) {
        navigate({ to: '/$tenantId', params: { tenantId: auth.user.membership[0].id.toString() } });
      }
    }
  }, [auth.user]);

  if (!auth.user || !auth.isAuthenticated) {
    return <Login />;
  }

  if (!auth.user?.membership?.length) {
    return <TenantSelector />;
  }

  return <Outlet />;
};
