import type { CompanyEventDto } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Building2 } from '@tradelink/ui/icons';

interface ParticipatingCompaniesCardProps {
  companies: CompanyEventDto[];
  onAddCompany?: () => void;
}

export const ParticipatingCompaniesCard = ({ companies, onAddCompany }: ParticipatingCompaniesCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Participating Companies ({companies.length})</h3>
        {onAddCompany && (
          <Button variant="outline" size="sm" onClick={onAddCompany}>
            <Building2 className="h-4 w-4 mr-1" />
            Add Company
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {companies.map(company => (
          <div key={company.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">{company.name}</p>
              <p className="text-sm text-muted-foreground">{company.contactsCount} contacts attending</p>
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <p className="text-muted-foreground text-center py-6">No companies assigned to this event yet.</p>
        )}
      </div>
    </div>
  );
};
