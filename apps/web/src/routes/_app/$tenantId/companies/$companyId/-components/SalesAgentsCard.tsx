import { Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { UserPlus } from '@tradelink/ui/icons';
import { AssignContactDialog } from 'components/contact/AssignContactDialog';
import { useState } from 'react';

import type { GetCompanyResponse } from '@tradelink/shared';
import { ContactIcon } from 'components/icons/ContactIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

interface SalesAgentsCardProps {
  companyId: string | number;
  contacts?: GetCompanyResponse['contact'];
}

export function SalesAgentsCard({ companyId, contacts = [] }: SalesAgentsCardProps) {
  const tenantId = useTenantParam();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  return (
    <>
      <AssignContactDialog
        companyId={Number(companyId)}
        onContactAssigned={() => {
          // Optionally refresh company data or show success message
          console.log('Contact assigned successfully');
          setIsAssignDialogOpen(false);
        }}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ContactIcon className="h-5 w-5" />
            Contacts ({contacts.length})
          </CardTitle>
          <Button variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent>
          <div className="gap-3 flex flex-col">
            {contacts.map(contact => (
              <Link
                key={contact.id}
                to="/$tenantId/contacts/$contactId"
                params={{ tenantId, contactId: contact.id.toString() }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow shadow-none">
                  <CardContent>
                    <p className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {contacts.length === 0 && (
              <p className="text-muted-foreground text-center py-6">No sales agents assigned to this company.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
