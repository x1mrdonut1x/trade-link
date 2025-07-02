import type { GetCompanyResponse } from '@tradelink/shared/company';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Building2, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

interface CompanyInfoCardProps {
  company: GetCompanyResponse;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground pb-2">{company.description}</p>

        {/* <div className="flex flex-wrap gap-1">
          {company.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div> */}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Size:</span>
              <span>{company.size}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{company.country}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{company.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span className="truncate">{company.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Website:</span>
              <span>{company.website}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
