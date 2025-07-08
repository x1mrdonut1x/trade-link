import { Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Building2, Edit, Mail, MapPin, MoreHorizontal, Phone, Trash2, Users } from '@tradelink/ui/icons';

import type { CompanyDto } from '@tradelink/shared';
import { useTenantParam } from 'hooks/use-tenant-param';

interface CompanyCardProps {
  company: CompanyDto & { contactsCount: number };
}

export function CompanyCard({ company }: CompanyCardProps) {
  const tenantId = useTenantParam();

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to="/$tenantId/companies/$companyId" params={{ tenantId, companyId: company.id.toString() }}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <CardTitle className="text-lg">{company.name}</CardTitle>
          </div>
          <div onClick={handleDropdownClick}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {/* {company.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))} */}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{company.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{company.email}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{company.contactsCount}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{company.eventsCount}</span>
              </div> */}
            </div>
            {/* <div className="text-xs text-muted-foreground">Last contact: {company.lastContact}</div> */}
          </div>

          {/* {company.customFields.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Custom Fields:</p>
              <div className="space-y-1">
                {company.customFields.slice(0, 2).map((field, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{field.name}:</span> {field.value}
                  </div>
                ))}
                {company.customFields.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{company.customFields.length - 2} more fields</div>
                )}
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </Link>
  );
}
