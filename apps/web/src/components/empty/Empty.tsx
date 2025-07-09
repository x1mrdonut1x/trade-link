interface EmptyProps {
  title?: string;
  description?: string;
  icon: React.ElementType;
}

export const Empty = (props: EmptyProps) => {
  const { title, description, icon: Icon } = props;

  return (
    <div className="text-center py-6">
      <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
