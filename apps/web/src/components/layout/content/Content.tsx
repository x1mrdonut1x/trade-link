import { Outlet } from '@tanstack/react-router';
import { Separator } from '@tradelink/ui/components/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@tradelink/ui/components/sidebar';
import { AppBreadcrumb } from '../breadcrumb/AppBreadcrumb';
import { AppSidebar } from '../sidebar/Sidebar';

export const Content = () => {
  return (
    <div className="p-6 space-y-6">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-8 mb-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <AppBreadcrumb />
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
