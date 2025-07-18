import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Separator } from '@tradelink/ui/components/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@tradelink/ui/components/sidebar';
import { AppBreadcrumb } from 'components/layout/breadcrumb/AppBreadcrumb';
import { AppSidebar } from 'components/layout/sidebar/Sidebar';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

export const Route = createFileRoute('/_app/$tenantId')({
  component: TenantGuard,
  beforeLoad: async ({ context, params }) => {
    if (!context.auth.user?.membership?.some(m => m.id.toString() === params.tenantId)) {
      throw redirect({ to: '/' });
    }
  },
});

function TenantGuard() {
  const { tenantId } = Route.useParams();

  useBreadcrumbSetup([{ title: 'Dashboard', href: `/${tenantId}`, isActive: false }]);

  return (
    <div className="p-2 sm:p-6 space-y-6 h-screen flex flex-col">
      <SidebarProvider className="flex-1">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-8 mb-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <AppBreadcrumb />
            </div>
          </header>
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
