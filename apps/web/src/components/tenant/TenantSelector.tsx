import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { ArrowRight, Building2, Plus } from '@tradelink/ui/icons';
import { useAuth } from 'context';
import { useState } from 'react';
import { tenantApi, userTenantsQueryOptions } from '../../api/tenant';

export function TenantSelector() {
  const auth = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [tenantName, setTenantName] = useState('');

  const { data: tenantsData, isLoading } = useQuery(userTenantsQueryOptions());

  const createTenantMutation = useMutation({
    mutationFn: tenantApi().createTenant,
    onSuccess: async newTenant => {
      await auth.refreshToken();
      queryClient.invalidateQueries({ queryKey: ['user-tenants'] });
      // Navigate to the new tenant
      navigate({ to: `/$tenantId`, params: { tenantId: newTenant.id.toString() } });
    },
  });

  const handleCreateTenant = () => {
    if (tenantName.trim()) {
      createTenantMutation.mutate({ name: tenantName.trim() });
    }
  };

  const handleSelectTenant = (tenantId: number) => {
    navigate({ to: `/$tenantId`, params: { tenantId: tenantId.toString() } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading tenants...</p>
        </div>
      </div>
    );
  }

  const tenants = tenantsData?.tenants || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-6">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Select Organization</h1>
          <p className="text-gray-600 mt-2">
            {tenants.length > 0
              ? 'Choose an organization to continue or create a new one'
              : 'Create your first organization to get started'}
          </p>
        </div>

        {tenants.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-700">Your Organizations</h2>
            {tenants.map(tenant => (
              <Card
                key={tenant.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectTenant(tenant.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(tenant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="border-t pt-6">
          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Organization</CardTitle>
                <CardDescription>Enter a name for your new organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput label="Organization Name" required>
                  <Input
                    id="tenant-name"
                    value={tenantName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantName(e.target.value)}
                    placeholder="e.g., My Hotel Chain"
                  />
                </FormInput>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setTenantName('');
                  }}
                  disabled={createTenantMutation.isPending}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTenant} disabled={!tenantName.trim() || createTenantMutation.isPending}>
                  {createTenantMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Organization
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
