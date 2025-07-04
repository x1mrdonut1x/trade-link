import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import 'index.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { AuthProvider, useAuth } from './context/auth-context';
import { BreadcrumbProvider } from './context/breadcrumb-context';
import { queryClient } from './lib/query-client';
import { router } from './lib/router';

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BreadcrumbProvider>
          <InnerApp />
        </BreadcrumbProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const root = document.querySelector('#root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
