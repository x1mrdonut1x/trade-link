import { Link } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tradelink/ui/components/breadcrumb';
import { useBreadcrumb } from 'context/breadcrumb-context';
import { Fragment } from 'react/jsx-runtime';

export const AppBreadcrumb = () => {
  const { breadcrumbs, isLoading } = useBreadcrumb();

  // Show nothing if no breadcrumbs are set
  if (breadcrumbs.length === 0 && !isLoading) {
    return null;
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={`${breadcrumb.href}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
              {breadcrumb.isLoading ? (
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              ) : (breadcrumb.isActive || index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="line-clamp-1 max-w-[200px]">{breadcrumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="line-clamp-1 max-w-[200px]">
                  <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                </BreadcrumbLink>
              ))}
            </BreadcrumbItem>
          </Fragment>
        ))}
        {/* Show loading skeleton if the entire breadcrumb is loading */}
        {isLoading && breadcrumbs.length === 0 && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
