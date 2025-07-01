import { BedDouble, Calendar, CheckSquare, Contact, FileUp, LayoutDashboard, Store } from 'lucide-react';
import * as React from 'react';

import { TeamSwitcher } from '../../../components/layout/sidebar/TeamSwitcher';
import { NavUser } from '../../../components/layout/sidebar/User';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@tradelink/ui/components/sidebar';
import { Link, useMatchRoute } from '@tanstack/react-router';

// This is sample data.
const data = {
  user: {
    name: 'Alex Niznik',
    email: 'alex@niznik.info',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Trade Link CRM',
      logo: BedDouble,
      plan: '',
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Companies',
      url: '/companies',
      icon: Store,
    },
    {
      name: 'Contacts',
      url: '/contacts',
      icon: Contact,
    },
    {
      name: 'Events',
      url: '/events',
      icon: Calendar,
    },
    {
      name: 'Import Data',
      url: '/import',
      icon: FileUp,
    },
    {
      name: 'Tasks & Reminders',
      url: '/tasks',
      icon: CheckSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <SidebarMenu>
          {data.projects.map(item => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={Boolean(matchRoute({ to: item.url, fuzzy: true }))}>
                <Link to={item.url} activeProps={{ style: { fontWeight: '600' } }}>
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
