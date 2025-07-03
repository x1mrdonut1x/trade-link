import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function authQueryOptions() {
  return queryOptions({
    queryKey: ['auth'],
    queryFn: () => fetch('auth') as unknown as { user: string },
  });
}

export function useAuthQuery() {
  return useQuery(authQueryOptions());
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async () => {
      return fetch('sign-in');
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryOptions().queryKey, { user: 'test' });
      sessionStorage.setItem('access-token', 'test-token');
    },
    onError: () => {
      sessionStorage.removeItem('access-token');
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['sign-out'],
    mutationFn: async () => {
      return fetch('sign-out');
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryOptions().queryKey, undefined);
      sessionStorage.removeItem('access-token');
    },
  });
}
