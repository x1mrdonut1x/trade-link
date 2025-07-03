import type { ContactWithCompanyDto } from '@tradelink/shared/contact';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Building2, Mail, MapPin, Phone } from '@tradelink/ui/icons';

interface ContactDetailsCardProps {
  contact: ContactWithCompanyDto;
}

export function ContactDetailsCard({ contact }: ContactDetailsCardProps) {
  const hasAddressData = contact?.address || contact?.city || contact?.country || contact?.postCode;

  if (!hasAddressData && !contact.company) {
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
              {contact?.address && <div>{contact.address}</div>}
              <div>{[contact?.city, contact?.postCode].filter(Boolean).join(' ')}</div>
              {contact?.country && <div>{contact.country}</div>}
            </div>
          </div>
        )}

        {contact.company && (
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
              {contact.company.phoneNumber && (
                <div className="text-sm flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="font-medium">Phone:</span> {contact.company.phonePrefix}&nbsp;{contact.company.phoneNumber}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
