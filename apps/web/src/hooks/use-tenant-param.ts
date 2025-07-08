import { useParams } from '@tanstack/react-router';

export const useTenantParam = (): string => {
  const { tenantId } = useParams({ strict: false });

  if (!tenantId) {
    throw new Error('Tenant ID is missing from the URL parameters.');
  }

  return tenantId;
};
