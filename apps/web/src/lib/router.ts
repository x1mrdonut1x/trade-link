import type { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import type { IAuthContext } from '@/context/auth-context';
import { routeTree } from '../routeTree.gen';
import { queryClient } from './query-client';

type RouterContext = {
  auth: IAuthContext;
  queryClient: QueryClient;
};

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: null as unknown as IAuthContext,
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
export type { RouterContext };
