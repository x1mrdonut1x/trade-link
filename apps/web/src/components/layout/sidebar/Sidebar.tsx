import { BedDouble, Calendar, LayoutDashboard, Store, Users } from 'lucide-react';
import * as React from 'react';

import { TeamSwitcher } from '@/components/layout/sidebar/TeamSwitcher';
import { NavUser } from '@/components/layout/sidebar/User';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';

// This is sample data.
const data = {
  user: {
    name: 'Alex Niznik',
    email: 'alex@niznik.info',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'White Sand Luxury Villas & SPA',
      logo: BedDouble,
      plan: '',
    },
    {
      name: 'Zanzibar Kite Paradise',
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
      name: 'Agents',
      url: '/agents',
      icon: Users,
    },
    {
      name: 'Events',
      url: '/events',
      icon: Calendar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <SidebarMenu>
          {data.projects.map(item => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
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
