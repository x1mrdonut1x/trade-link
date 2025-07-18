import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback } from '@tradelink/ui/components/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Mail, MapPin, Phone, User } from '@tradelink/ui/icons';

import type { ContactWithCompanyDto } from '@tradelink/shared/contact';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

interface ContactInfoCardProps {
  contact: ContactWithCompanyDto;
}

export function ContactInfoCard({ contact }: ContactInfoCardProps) {
  const tenantId = useTenantParam();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const fullPhone =
    contact?.phonePrefix && contact?.phoneNumber
      ? `${contact.phonePrefix} ${contact.phoneNumber}`
      : contact?.phoneNumber || 'Not provided';

  const location = [contact?.city, contact?.country].filter(Boolean).join(', ') || 'Not provided';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(contact.firstName, contact.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.jobTitle && <p className="text-muted-foreground">{contact.jobTitle}</p>}
            {contact.company?.name ? (
              <Link
                to="/$tenantId/companies/$companyId"
                params={{ tenantId, companyId: contact.company.id.toString() }}
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                {contact.company.name}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No company</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span className="truncate">{contact.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{fullPhone}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CompanyIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Company:</span>
              {contact.company?.name ? (
                <Link
                  to="/$tenantId/companies/$companyId"
                  params={{ tenantId, companyId: contact.company.id.toString() }}
                  className="text-blue-600 hover:underline"
                >
                  {contact.company.name}
                </Link>
              ) : (
                <span>No company</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
