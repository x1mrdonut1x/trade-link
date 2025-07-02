import { createContext, type ReactNode, useCallback, useContext, useEffect, useId, useState } from 'react';

export interface BreadcrumbItem {
  id: string;
  title: string;
  href: string;
  isActive: boolean;
  isLoading?: boolean;
}

export interface IBreadcrumbContext {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
  resetBreadcrumbs: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const BreadcrumbContext = createContext<IBreadcrumbContext | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
    setIsLoading(false);
  }, []);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        resetBreadcrumbs,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }

  return context;
}

// Hook to automatically set up breadcrumbs for a route
export function useBreadcrumbSetup(newBreadcrumbs: Omit<BreadcrumbItem, 'id'>[], isLoading?: boolean) {
  const { setBreadcrumbs, setIsLoading } = useBreadcrumb();
  const id = useId();

  useEffect(() => {
    setBreadcrumbs(prev => [...prev, ...newBreadcrumbs.map(b => ({ ...b, id }))]);

    if (isLoading !== undefined) {
      setIsLoading(isLoading);
    }

    return () => {
      setBreadcrumbs(prev => prev.filter(b => b.id !== id));
    };
  }, [JSON.stringify(newBreadcrumbs), isLoading, setBreadcrumbs, setIsLoading]);
}
