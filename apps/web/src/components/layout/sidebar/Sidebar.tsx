import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@tradelink/ui/components/sidebar';
import { FileUp, LayoutDashboard, Settings } from '@tradelink/ui/icons';
import * as React from 'react';
import { TenantSwitcher } from './TenantSwitcher';
import { NavUser } from './User';

import { CompanyIcon } from 'components/icons/CompanyIcon';
import { ContactIcon } from 'components/icons/ContactIcon';
import { EventIcon } from 'components/icons/EventIcon';
import { TaskIcon } from 'components/icons/TaskIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

// This is sample data.
const data = {
  user: {
    name: 'Alex Niznik',
    email: 'alex@niznik.info',
    avatar: '/avatars/shadcn.jpg',
  },
  projects: [
    {
      name: 'Dashboard',
      url: '/$tenantId',
      icon: LayoutDashboard,
    },
    {
      name: 'Companies',
      url: '/$tenantId/companies',
      icon: CompanyIcon,
    },
    {
      name: 'Contacts',
      url: '/$tenantId/contacts',
      icon: ContactIcon,
    },
    {
      name: 'Events',
      url: '/$tenantId/events',
      icon: EventIcon,
    },
    {
      name: 'Tasks',
      url: '/$tenantId/tasks',
      icon: TaskIcon,
    },
    {
      name: 'Import Data',
      url: '/$tenantId/import',
      icon: FileUp,
    },
    {
      name: 'Settings',
      url: '/$tenantId/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tenantId = useTenantParam();
  const matchRoute = useMatchRoute();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher />
        <SidebarMenu>
          {data.projects.map(item => {
            const shouldFuzzy = item.url !== '/$tenantId';
            const isActive = Boolean(matchRoute({ to: item.url, fuzzy: shouldFuzzy }));

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    to={item.url}
                    params={{ tenantId }}
                    activeOptions={{ exact: !shouldFuzzy }}
                    activeProps={{ style: { fontWeight: '600' } }}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
