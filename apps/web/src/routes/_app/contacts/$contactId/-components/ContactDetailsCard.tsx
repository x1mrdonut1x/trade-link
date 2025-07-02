import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Building2, MapPin, Mail, Phone } from 'lucide-react';
import type { ContactWithCompanyDto } from '@tradelink/shared/contact';

interface ContactDetailsCardProps {
  contact: ContactWithCompanyDto;
}

export function ContactDetailsCard({ contact }: ContactDetailsCardProps) {
  // Extract contact data safely
  const contactData = contact.contactData as {
    country?: string;
    city?: string;
    address?: string;
    postCode?: string;
    phonePrefix?: string;
    phoneNumber?: string;
  } | null;

  const hasAddressData = contactData?.address || contactData?.city || contactData?.country || contactData?.postCode;
  const hasCompanyData = contact.company;

  if (!hasAddressData && !hasCompanyData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Additional Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasAddressData && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {contactData?.address && <div>{contactData.address}</div>}
              <div>
                {[contactData?.city, contactData?.postCode].filter(Boolean).join(' ')}
              </div>
              {contactData?.country && <div>{contactData.country}</div>}
            </div>
          </div>
        )}

        {hasCompanyData && contact.company && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Information
            </h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span> {contact.company.name}
              </div>
              {contact.company.email && (
                <div className="text-sm flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">Email:</span> {contact.company.email}
                </div>
              )}
              {contact.company.phone && (
                <div className="text-sm flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="font-medium">Phone:</span> {contact.company.phone}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
