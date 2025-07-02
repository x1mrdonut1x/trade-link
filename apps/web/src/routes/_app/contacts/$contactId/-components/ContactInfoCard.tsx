import { Avatar, AvatarFallback } from '@tradelink/ui/components/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import type { ContactWithCompanyDto } from '@tradelink/shared/contact';

interface ContactInfoCardProps {
  contact: ContactWithCompanyDto;
}

export function ContactInfoCard({ contact }: ContactInfoCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Extract contact data safely
  const contactData = contact.contactData as {
    country?: string;
    city?: string;
    address?: string;
    postCode?: string;
    phonePrefix?: string;
    phoneNumber?: string;
  } | null;

  const fullPhone = contactData?.phonePrefix && contactData?.phoneNumber 
    ? `${contactData.phonePrefix} ${contactData.phoneNumber}`
    : contactData?.phoneNumber || 'Not provided';

  const location = [contactData?.city, contactData?.country].filter(Boolean).join(', ') || 'Not provided';
  const companyName = contact.company?.name || 'No company';

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
            <AvatarFallback className="text-lg">
              {getInitials(contact.firstName, contact.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{contact.firstName} {contact.lastName}</h3>
            {contact.jobTitle && <p className="text-muted-foreground">{contact.jobTitle}</p>}
            <p className="text-sm text-muted-foreground mt-1">{companyName}</p>
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
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Company:</span>
              <span>{companyName}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
