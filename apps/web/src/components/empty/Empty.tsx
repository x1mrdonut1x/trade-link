interface EmptyProps {
  size?: 'sm' | 'default';
  title?: string;
  description?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const Empty = (props: EmptyProps) => {
  const { title, description, icon: Icon, children, size = 'default' } = props;

  if (size === 'sm') {
    return (
      <div className="text-center py-4">
        {Icon && <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />}
        {title && <h3 className=" font-medium mb-2">{title}</h3>}
        {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
        {children}
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      {children}
    </div>
  );
};
