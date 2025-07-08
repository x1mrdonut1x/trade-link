interface EventQuickStatsCardProps {
  companiesCount: number;
  agentsCount: number;
  status: string;
}

export const EventQuickStatsCard = ({ companiesCount, agentsCount, status }: EventQuickStatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Companies</span>
          <span className="font-semibold">{companiesCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Contacts</span>
          <span className="font-semibold">{agentsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="font-semibold capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
};
