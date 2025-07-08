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
import { Building2, Calendar, CheckSquare, Contact, FileUp, LayoutDashboard, Settings } from '@tradelink/ui/icons';
import * as React from 'react';
import { TenantSwitcher } from './TenantSwitcher';
import { NavUser } from './User';

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
      url: '/$tenantId/',
      icon: LayoutDashboard,
    },
    {
      name: 'Companies',
      url: '/$tenantId/companies',
      icon: Building2,
    },
    {
      name: 'Contacts',
      url: '/$tenantId/contacts',
      icon: Contact,
    },
    {
      name: 'Events',
      url: '/$tenantId/events',
      icon: Calendar,
    },
    {
      name: 'Tasks',
      url: '/$tenantId/tasks',
      icon: CheckSquare,
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
          {data.projects.map(item => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={Boolean(matchRoute({ to: item.url, fuzzy: true }))}>
                <Link to={item.url} params={{ tenantId }} activeProps={{ style: { fontWeight: '600' } }}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
