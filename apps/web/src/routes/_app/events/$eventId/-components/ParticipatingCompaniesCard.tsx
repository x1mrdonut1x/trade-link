interface Company {
  id: number;
  name: string;
  agentsCount: number;
}

interface ParticipatingCompaniesCardProps {
  companies: Company[];
}

export const ParticipatingCompaniesCard = ({ companies }: ParticipatingCompaniesCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Participating Companies ({companies.length})</h3>
      <div className="space-y-3">
        {companies.map(company => (
          <div key={company.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">{company.name}</p>
              <p className="text-sm text-muted-foreground">{company.agentsCount} agents attending</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
