import type { CompanyEventDto } from '@tradelink/shared';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { GenericParticipantsCard } from './GenericParticipantsCard';

interface ParticipatingCompaniesCardProps {
  companies: CompanyEventDto[];
  onAddCompany?: () => void;
}

export const ParticipatingCompaniesCard = ({ companies, onAddCompany }: ParticipatingCompaniesCardProps) => {
  return (
    <GenericParticipantsCard
      title="Participating Companies"
      icon={<CompanyIcon className="h-5 w-5 mr-2" />}
      items={companies}
      onAddItem={onAddCompany}
      renderItem={company => (
        <div>
          <p className="font-medium">{company.name}</p>
          <p className="text-sm text-muted-foreground">{company.contactsCount} contacts attending</p>
        </div>
      )}
      emptyMessage="No companies assigned to this event yet."
      addButtonText="Add"
    />
  );
};
