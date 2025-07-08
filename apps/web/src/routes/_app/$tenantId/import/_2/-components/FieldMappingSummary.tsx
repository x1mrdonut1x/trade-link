interface FieldMappingSummaryProps {
  title: string;
  fields: readonly { readonly key: string; readonly label: string; readonly required?: boolean }[];
  mappings: Array<{ targetField: string; csvColumnIndex: number }>;
  colorClass: 'blue' | 'green';
}

export function FieldMappingSummary({ title, fields, mappings, colorClass }: FieldMappingSummaryProps) {
  const colorClasses = {
    blue: {
      header: 'text-blue-900',
      dot: 'bg-blue-500',
    },
    green: {
      header: 'text-green-900',
      dot: 'bg-green-500',
    },
  };

  const colors = colorClasses[colorClass];

  return (
    <div>
      <h4 className={`font-medium ${colors.header} mb-2 flex items-center gap-1`}>
        <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
        {title}
      </h4>
      <div className="space-y-1">
        {fields.map(field => {
          const isMapped = mappings.some(m => m.targetField === field.key);

          return (
            <div
              key={field.key}
              className={`flex items-center justify-between px-2 py-1 rounded ${
                isMapped
                  ? 'bg-green-100 text-green-800'
                  : field.required
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span>{field.label}</span>
              <span className="text-xs">{isMapped ? '✓ Mapped' : field.required ? '✗ Required' : 'Optional'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
