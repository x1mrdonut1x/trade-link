interface CustomField {
  name: string;
  value: string;
}

interface EventAdditionalDetailsCardProps {
  customFields: CustomField[];
}

export const EventAdditionalDetailsCard = ({ customFields }: EventAdditionalDetailsCardProps) => {
  if (customFields.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
      <div className="space-y-3">
        {customFields.map((field, index) => (
          <div key={index}>
            <span className="text-sm font-medium text-muted-foreground">{field.name}:</span>
            <p className="text-sm mt-1">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
