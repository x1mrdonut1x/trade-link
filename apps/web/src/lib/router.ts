import { createRouter } from '@tanstack/react-router';

import { routeTree } from '../routeTree.gen';
import { queryClient } from './query-client';

import type { IAuthContext } from '../context/auth-context';
import type { QueryClient } from '@tanstack/react-query';

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
