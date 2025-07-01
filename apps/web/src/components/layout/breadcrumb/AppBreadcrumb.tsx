import { Link, useLocation } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tradelink/ui/components/breadcrumb';
import { Fragment } from 'react/jsx-runtime';

// Mock data imports to get real names
const mockCompanies = [
  { id: 1, name: 'Grand Hotels Corporation' },
  { id: 2, name: 'Boutique Hospitality Group' },
  { id: 3, name: 'Resort & Spa International' },
];

const mockContacts = [
  { id: 1, firstName: 'Sarah', lastName: 'Mitchell' },
  { id: 2, firstName: 'Marcus', lastName: 'Rodriguez' },
  { id: 3, firstName: 'Jennifer', lastName: 'Park' },
  { id: 4, firstName: 'David', lastName: 'Chen' },
];

const mockEvents = [
  { id: 1, name: 'International Hotel Investment Summit 2025' },
  { id: 2, name: 'Resort & Spa Trade Show' },
  { id: 3, name: 'Boutique Hotel Summit 2025' },
];

interface BreadcrumbItemData {
  title: string;
  href: string;
  isActive: boolean;
}

export const AppBreadcrumb = () => {
  const location = useLocation();

  // Generate breadcrumbs based on the current route
  const generateBreadcrumbs = (): BreadcrumbItemData[] => {
    const breadcrumbs: BreadcrumbItemData[] = [];
    const pathname = location.pathname;

    // Always start with home (but mark it active if we're actually on the home page)
    breadcrumbs.push({
      title: 'Dashboard',
      href: '/',
      isActive: pathname === '/',
    });

    // Parse the path to create breadcrumbs
    if (pathname.startsWith('/companies')) {
      breadcrumbs.push({
        title: 'Companies',
        href: '/companies',
        isActive: pathname === '/companies',
      });

      // Check if we're on a company detail page
      const companyIdMatch = pathname.match(/\/companies\/(\d+)/);
      if (companyIdMatch) {
        const companyId = parseInt(companyIdMatch[1]);
        const company = mockCompanies.find(c => c.id === companyId);
        const companyName = company ? company.name : `Company ${companyId}`;
        breadcrumbs.push({
          title: companyName,
          href: `/companies/${companyId}`,
          isActive: true,
        });
      }
    } else if (pathname.startsWith('/contacts')) {
      breadcrumbs.push({
        title: 'Sales Agents',
        href: '/contacts',
        isActive: pathname === '/contacts',
      });

      // Check if we're on a contact detail page
      const contactIdMatch = pathname.match(/\/contacts\/(\d+)/);
      if (contactIdMatch) {
        const contactId = parseInt(contactIdMatch[1]);
        const contact = mockContacts.find(c => c.id === contactId);
        const contactName = contact ? `${contact.firstName} ${contact.lastName}` : `Agent ${contactId}`;
        breadcrumbs.push({
          title: contactName,
          href: `/contacts/${contactId}`,
          isActive: true,
        });
      }
    } else if (pathname.startsWith('/events')) {
      breadcrumbs.push({
        title: 'Events',
        href: '/events',
        isActive: pathname === '/events',
      });

      // Check if we're on an event detail page
      const eventIdMatch = pathname.match(/\/events\/(\d+)/);
      if (eventIdMatch) {
        const eventId = parseInt(eventIdMatch[1]);
        const event = mockEvents.find(e => e.id === eventId);
        const eventName = event ? event.name : `Event ${eventId}`;
        breadcrumbs.push({
          title: eventName,
          href: `/events/${eventId}`,
          isActive: true,
        });
      }
    } else if (pathname.startsWith('/tasks')) {
      breadcrumbs.push({
        title: 'Tasks & Reminders',
        href: '/tasks',
        isActive: true,
      });
    } else if (pathname.startsWith('/import')) {
      breadcrumbs.push({
        title: 'Import Data',
        href: '/import',
        isActive: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={`${breadcrumb.href}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
              {breadcrumb.isActive || index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="line-clamp-1 max-w-[200px]">{breadcrumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="line-clamp-1 max-w-[200px]">
                  <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
