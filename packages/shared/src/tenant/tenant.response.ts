export interface TenantDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantResponse extends TenantDto {}

export interface GetTenantResponse extends TenantDto {}

export interface UpdateTenantResponse extends TenantDto {}

export interface DeleteTenantResponse {
  message: string;
}

export interface GetUserTenantsResponse {
  tenants: Array<
    TenantDto & {
      membership: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  >;
}
